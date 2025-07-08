import type { Job } from "../types";

async function createJob(data: Job): Promise<Job> {
  try {
    const response = await fetch("/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
}

async function getJob(jobId: string): Promise<Job> {
  try {
    const response = await fetch(`/api/jobs/${jobId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching job:", error);
    throw error;
  }
}
async function listJobs(): Promise<Job[]> {
  try {
    const response = await fetch("/api/jobs");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error listing jobs:", error);
    throw error;
  }
}
async function updateJob(jobId: string, jobData: Partial<Job>): Promise<Job> {
  try {
    const response = await fetch(`/api/jobs/${jobId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
}
async function deleteJob(jobId: string): Promise<void> {
  try {
    const response = await fetch(`/api/jobs/${jobId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
}

export const jobService = {
  createJob,
  getJob,
  listJobs,
  updateJob,
  deleteJob,
};
