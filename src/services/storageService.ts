async function uploadFile(
  containerName: string,
  fileName: string,
  fileBytes: Blob
): Promise<string> {
  const formData = new FormData();
  formData.append("container_name", containerName);
  formData.append("file_name", fileName);
  formData.append("file_bytes", fileBytes);

  try {
    const response = await fetch("/api/storage", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

async function downloadFile(
  containerName: string,
  fileName: string
): Promise<Blob> {
  try {
    const response = await fetch(
      `/api/storage?container_name=${containerName}&file_name=${fileName}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
}

async function listFiles(containerName: string): Promise<string[]> {
  try {
    const response = await fetch(
      `/api/storage?container_name=${containerName}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error listing files:", error);
    throw error;
  }
}

async function deleteFile(
  containerName: string,
  fileName: string
): Promise<void> {
  try {
    const response = await fetch(
      `/api/storage?container_name=${containerName}&file_name=${fileName}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

export const storageService = {
  uploadFile,
  downloadFile,
  listFiles,
  deleteFile,
};
