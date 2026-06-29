from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.log_routes import router as log_router


app = FastAPI(
    title="Log Reader API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Log Reader Backend Running!"
    }


app.include_router(log_router)