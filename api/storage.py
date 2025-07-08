import os, uuid, azure_config
from azure.core.credentials import AzureNamedKeyCredential
from azure.storage.blob import BlobServiceClient
from azure.data.tables import TableServiceClient

class Storage:
    def __init__(self):
        self.blob_service_client = BlobServiceClient(
            account_url=azure_config.STORAGE_URL,
            credential=AzureNamedKeyCredential(
                name=azure_config.STORAGE_ACCOUNT_NAME, 
                key=azure_config.STORAGE_ACCOUNT_KEY
            )
        )
        self.table_service_client = TableServiceClient(
            endpoint=azure_config.STORAGE_URL,
            credential=AzureNamedKeyCredential(
                name=azure_config.STORAGE_ACCOUNT_NAME,
                key=azure_config.STORAGE_ACCOUNT_KEY
            )
        )

    # Blob Storage Methods
    def upload_file(self, container_name, fileName, fileBytes):
        try:
            self.blob_service_client.create_container(container_name)
            self.blob_service_client.get_blob_client(container=container_name, blob=fileName).upload_blob(fileBytes)
            return self.blob_service_client
        except Exception as ex:
            print('Exception:')
            print(ex)

    def download_file(self, container_name, fileName):
        try:
            blob = self.blob_service_client.get_blob_client(container=container_name, blob=fileName).download_blob()
            return blob.readall()
        except Exception as ex:
            print('Exception:')
            print(ex)
        return None
    
    def delete_file(self, container_name, fileName):
        try:
            blob_client = self.blob_service_client.get_blob_client(container=container_name, blob=fileName)
            blob_client.delete_blob()
            return True
        except Exception as ex:
            print('Exception:')
            print(ex)
        return False
    
    def list_files(self, container_name):
        try:
            container_client = self.blob_service_client.get_container_client(container_name)
            return [blob.name for blob in container_client.list_blobs()]
        except Exception as ex:
            print('Exception:')
            print(ex)
        return []

    # Table Storage Methods

    def create_job(self, job_id, job_data):
        try:
            table_client = self.table_service_client.get_table_client(table_name='jobs')
            entity = {
                'PartitionKey': 'job',
                'RowKey': job_id,
                **job_data
            }
            table_client.create_entity(entity=entity)
            return True
        except Exception as ex:
            print('Exception:')
            print(ex)
        return False
    
    def get_job(self, job_id):
        try:
            table_client = self.table_service_client.get_table_client(table_name='jobs')
            entity = table_client.get_entity(partition_key='job', row_key=job_id)
            return entity
        except Exception as ex:
            print('Exception:')
            print(ex)
        return None
    
    def update_job(self, job_id, job_data):
        try:
            table_client = self.table_service_client.get_table_client(table_name='jobs')
            entity = {
                'PartitionKey': 'job',
                'RowKey': job_id,
                **job_data
            }
            table_client.update_entity(entity=entity)
            return True
        except Exception as ex:
            print('Exception:')
            print(ex)
        return False
    
    def delete_job(self, job_id):
        try:
            table_client = self.table_service_client.get_table_client(table_name='jobs')
            table_client.delete_entity(partition_key='job', row_key=job_id)
            return True
        except Exception as ex:
            print('Exception:')
            print(ex)
        return False