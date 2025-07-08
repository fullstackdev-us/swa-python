# https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-python?tabs=get-started%2Casgi%2Capplication-level&pivots=python-mode-decorators
import azure.functions as func
import storage
import uuid

app = func.FunctionApp()

# Storage

@app.function_name(name="UploadFile")
@app.route(route="storage", methods=["POST"])
def upload(req: func.HttpRequest) -> func.HttpResponse:
    container_name = req.params.get("container_name")
    file_name = req.params.get("file_name")
    file_bytes = req.get_body()
    if storage.upload_file(container_name, file_name, file_bytes):
        return func.HttpResponse("File uploaded successfully.", status_code=200)
    return func.HttpResponse("Failed to upload file.", status_code=500)

@app.function_name(name="DownloadFile")
@app.route(route="storage/download", methods=["GET"])
def download(req: func.HttpRequest) -> func.HttpResponse:
    container_name = req.params.get("container_name")
    file_name = req.params.get("file_name")
    file_bytes = storage.download_file(container_name, file_name)
    if file_bytes:
        return func.HttpResponse(file_bytes, status_code=200)
    return func.HttpResponse("Failed to download file.", status_code=500)

@app.function_name(name="DeleteFile")
@app.route(route="storage", methods=["DELETE"])
def delete(req: func.HttpRequest) -> func.HttpResponse:
    container_name = req.params.get("container_name")
    file_name = req.params.get("file_name")
    if storage.delete_file(container_name, file_name):
        return func.HttpResponse("File deleted successfully.", status_code=200)
    return func.HttpResponse("Failed to delete file.", status_code=500)

@app.function_name(name="ListFiles")
@app.route(route="storage", methods=["GET"])
def list_files(req: func.HttpRequest) -> func.HttpResponse:
    container_name = req.params.get("container_name")
    files = storage.list_files(container_name)
    if files:
        return func.HttpResponse(files, status_code=200)
    return func.HttpResponse("Failed to list files.", status_code=500)

# Jobs

@app.function_name(name="CreateJob")
@app.route(route="jobs", methods=["POST"])
def create_job(req: func.HttpRequest) -> func.HttpResponse:
    job_id = uuid.uuid4()
    job_data = req.get_json()
    if storage.create_job(job_id, job_data):
        return func.HttpResponse("Job created successfully.", status_code=200)
    return func.HttpResponse("Failed to create job.", status_code=500)

@app.function_name(name="GetJob")
@app.route(route="jobs/{job_id}", methods=["GET"])
def get_job(req: func.HttpRequest) -> func.HttpResponse:
    job_id = req.params.get("job_id")
    job_data = storage.get_job(job_id)
    if job_data:
        return func.HttpResponse(job_data, status_code=200)
    return func.HttpResponse("Failed to retrieve job.", status_code=500)

@app.function_name(name="UpdateJob")
@app.route(route="jobs/{job_id}", methods=["PUT"])
def update_job(req: func.HttpRequest) -> func.HttpResponse:
    job_id = req.params.get("job_id")
    job_data = req.get_json()
    if storage.update_job(job_id, job_data):
        return func.HttpResponse("Job updated successfully.", status_code=200)
    return func.HttpResponse("Failed to update job.", status_code=500)

@app.function_name(name="DeleteJob")
@app.route(route="jobs/{job_id}", methods=["DELETE"])
def delete_job(req: func.HttpRequest) -> func.HttpResponse:
    job_id = req.params.get("job_id")
    if storage.delete_job(job_id):
        return func.HttpResponse("Job deleted successfully.", status_code=200)
    return func.HttpResponse("Failed to delete job.", status_code=500)
