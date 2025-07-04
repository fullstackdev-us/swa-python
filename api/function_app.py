# https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-python?tabs=get-started%2Casgi%2Capplication-level&pivots=python-mode-decorators
import azure.functions as func

app = func.FunctionApp()

@app.function_name(name="HttpTrigger1")
@app.route(route="trigger1")
def main(req: func.HttpRequest) -> func.HttpResponse:
    user = req.params.get("user")
    return func.HttpResponse(f"Hello, {user}!")

@app.function_name(name="HttpTrigger2")
@app.route(route="trigger2")
def greet(req: func.HttpRequest) -> func.HttpResponse:
    name = req.params.get("name", "World")
    return func.HttpResponse(f"Greetings, {name}!")