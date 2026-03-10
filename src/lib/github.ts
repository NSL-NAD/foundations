import { Octokit } from "@octokit/rest";

function getOctokit() {
  const token = process.env.GITHUB_TOKEN?.trim();
  if (!token) {
    throw new Error("GITHUB_TOKEN environment variable is not set");
  }
  return new Octokit({ auth: token });
}

function getRepo() {
  const repo = process.env.GITHUB_REPO?.trim() || "";
  const [owner, name] = repo.split("/");
  if (!owner || !name) {
    throw new Error(
      'GITHUB_REPO must be in "owner/repo" format (e.g. "NSL-NAD/foundations")'
    );
  }
  return { owner, repo: name };
}

/**
 * Get a file's content and SHA from the repo (needed for updates).
 */
export async function getFileContent(filePath: string) {
  const octokit = getOctokit();
  const { owner, repo } = getRepo();

  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: filePath,
    });

    if (Array.isArray(data) || data.type !== "file") {
      throw new Error(`Path "${filePath}" is not a file`);
    }

    const content = Buffer.from(data.content, "base64").toString("utf-8");
    return { content, sha: data.sha };
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      (error as { status: number }).status === 404
    ) {
      return null; // File doesn't exist
    }
    throw error;
  }
}

/**
 * Commit a single file to the main branch.
 */
export async function commitFile(
  filePath: string,
  content: string,
  message: string
) {
  const octokit = getOctokit();
  const { owner, repo } = getRepo();

  // Get the current file's SHA (needed for updates, null for new files)
  const existing = await getFileContent(filePath);

  const params: {
    owner: string;
    repo: string;
    path: string;
    message: string;
    content: string;
    sha?: string;
  } = {
    owner,
    repo,
    path: filePath,
    message,
    content: Buffer.from(content, "utf-8").toString("base64"),
  };

  if (existing) {
    params.sha = existing.sha;
  }

  const { data } = await octokit.repos.createOrUpdateFileContents(params);

  return {
    sha: data.content?.sha || "",
    commitSha: data.commit.sha,
    url: data.commit.html_url,
  };
}

/**
 * Atomic multi-file commit using the Git Trees API.
 * Useful for saving MDX + curriculum.json together.
 */
export async function commitMultipleFiles(
  files: Array<{ path: string; content: string }>,
  message: string
) {
  const octokit = getOctokit();
  const { owner, repo } = getRepo();

  // 1. Get the latest commit SHA on main
  const { data: ref } = await octokit.git.getRef({
    owner,
    repo,
    ref: "heads/main",
  });
  const latestCommitSha = ref.object.sha;

  // 2. Get the tree SHA from the latest commit
  const { data: commit } = await octokit.git.getCommit({
    owner,
    repo,
    commit_sha: latestCommitSha,
  });
  const baseTreeSha = commit.tree.sha;

  // 3. Create blobs for each file
  const tree = await Promise.all(
    files.map(async (file) => {
      const { data: blob } = await octokit.git.createBlob({
        owner,
        repo,
        content: Buffer.from(file.content, "utf-8").toString("base64"),
        encoding: "base64",
      });
      return {
        path: file.path,
        mode: "100644" as const,
        type: "blob" as const,
        sha: blob.sha,
      };
    })
  );

  // 4. Create a new tree
  const { data: newTree } = await octokit.git.createTree({
    owner,
    repo,
    base_tree: baseTreeSha,
    tree,
  });

  // 5. Create a new commit
  const { data: newCommit } = await octokit.git.createCommit({
    owner,
    repo,
    message,
    tree: newTree.sha,
    parents: [latestCommitSha],
  });

  // 6. Update the reference to point to the new commit
  await octokit.git.updateRef({
    owner,
    repo,
    ref: "heads/main",
    sha: newCommit.sha,
  });

  return {
    commitSha: newCommit.sha,
    url: newCommit.html_url,
  };
}
