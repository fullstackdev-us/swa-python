import { useEffect, useState } from "react";
import type { Job, JobFormData } from "./types";
import { jobService } from "./services/jobService";
import { storageService } from "./services/storageService";
import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  List,
  message,
  Modal,
  Select,
  Skeleton,
  Tooltip,
  Upload,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";

const FILE_CONTAINER_NAME = "files";

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [targetJob, setTargetJob] = useState<Job>();
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showJobModal, setShowJobModal] = useState<boolean>(false);
  const [form] = Form.useForm();

  function handleCreateJob() {
    setShowJobModal(true);
  }

  async function handleDeleteFile(fileName: string) {
    try {
      setIsLoading(true);
      await storageService.deleteFile(FILE_CONTAINER_NAME, fileName);
      setFileNames((prev) => prev.filter((name) => name !== fileName));
      message.success(`${fileName} file deleted successfully`);
    } catch (error) {
      console.error("Error deleting file:", error);
      message.error(`Failed to delete ${fileName} file`);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDownloadFile(fileName: string) {
    try {
      setIsLoading(true);
      const blob = await storageService.downloadFile(
        FILE_CONTAINER_NAME,
        fileName
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Remove Formik references and update handleSubmitJob to work with Ant Design Form
  async function handleSubmitJob(values: JobFormData) {
    try {
      setIsLoading(true);
      const payload = {
        ...targetJob,
        ...values,
      } as Job;
      if (targetJob?.PartitionKey) {
        const updatedJob = await jobService.updateJob(
          targetJob?.PartitionKey,
          payload
        );
        const otherJobs = jobs.filter(
          (j) => j.PartitionKey !== targetJob.PartitionKey
        );
        setJobs([...otherJobs, updatedJob]);
      } else {
        const newJob = await jobService.createJob(payload);
        setJobs([...jobs, newJob]);
      }
      setShowJobModal(false);
      setTargetJob(undefined);
    } catch (error) {
      console.error("Error saving job:", error);
      message.error("Failed to save job");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function init() {
      try {
        setIsLoading(true);
        const jobsResponse = await jobService.listJobs();
        setJobs(jobsResponse);
        const fileNamesResponse = await storageService.listFiles(
          FILE_CONTAINER_NAME
        );
        setFileNames(fileNamesResponse);
      } catch (error) {
        console.error("Error during initialization:", error);
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, []);

  useEffect(() => {
    if (showJobModal) {
      form.setFieldsValue(
        targetJob || { name: "", description: "", status: "" }
      );
    }
  }, [targetJob, showJobModal, form]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
        width: "100%",
      }}
    >
      <Card
        style={{ width: "80%", marginBottom: "20px" }}
        title="Files"
        loading={isLoading}
      >
        <List
          dataSource={fileNames}
          renderItem={(fileName) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  onClick={() => handleDownloadFile(fileName)}
                >
                  Download
                </Button>,
                <Button type="link" onClick={() => handleDeleteFile(fileName)}>
                  Delete
                </Button>,
              ]}
            >
              <Skeleton avatar title={false} loading={isLoading} active>
                <List.Item.Meta
                  avatar={<Avatar src={"https://placekittens.com/50/50"} />}
                  title={`${fileName}`}
                  description=""
                />
              </Skeleton>
            </List.Item>
          )}
        />
        <Tooltip title="Upload a new file" placement="right">
          <Upload
            name="file"
            action={"/api/storage"}
            onChange={(info) => {
              if (info.file.status !== "uploading") {
                console.log(info.file, info.fileList);
              }
              if (info.file.status === "done") {
                message.success(`${info.file.name} file uploaded successfully`);
                setFileNames((prev) => [...prev, info.file.name]);
              } else if (info.file.status === "error") {
                message.error(`${info.file.name} file upload failed.`);
              }
            }}
          >
            <Button
              type="primary"
              icon={<UploadOutlined />}
              style={{ marginTop: "1rem" }}
            ></Button>
          </Upload>
        </Tooltip>
      </Card>
      <Card
        style={{ width: "80%", marginBottom: "20px" }}
        title="Jobs"
        loading={isLoading}
      >
        <List
          dataSource={jobs}
          rowKey="RowKey"
          renderItem={(job) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  onClick={() => {
                    setTargetJob(job);
                    setShowJobModal(true);
                  }}
                >
                  Edit
                </Button>,
              ]}
            >
              <Skeleton avatar title={false} loading={isLoading} active>
                <List.Item.Meta
                  avatar={<Avatar src={"https://placekittens.com/50/50"} />}
                  title={`${job.name} (${job.RowKey})`}
                  description=""
                />
                <div>Status: {job.status}</div>
              </Skeleton>
            </List.Item>
          )}
        />
        <Tooltip title="Create a new job" placement="right">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateJob}
            style={{ marginTop: "1rem" }}
          ></Button>
        </Tooltip>
      </Card>

      <Modal
        title={targetJob ? `Edit Job: ${targetJob.name}` : "Create Job"}
        open={showJobModal}
        onCancel={() => {
          setShowJobModal(false);
          setTargetJob(undefined);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={targetJob || { name: "", description: "", status: "" }}
          onFinish={async (values) => {
            await handleSubmitJob(values);
            form.resetFields();
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the job name" }]}
          >
            <Input placeholder="Enter job name" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please enter the job description",
              },
            ]}
          >
            <Input.TextArea placeholder="Enter job description" />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select placeholder="Select status">
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="running">Running</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
              <Select.Option value="failed">Failed</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              style={{ marginRight: 8 }}
            >
              {targetJob ? "Update Job" : "Create Job"}
            </Button>
            <Button onClick={() => setShowJobModal(false)} disabled={isLoading}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default App;
