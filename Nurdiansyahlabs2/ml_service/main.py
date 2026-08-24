from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# Definisikan format data yang akan diterima dari Laravel
class InputData(BaseModel):
    teks: str
    nilai: float

@app.get("/")
def read_root():
    return {"status": "ML Microservice Aktif"}

@app.post("/predict")
def predict_data(data: InputData):
    # ----------------------------------------------------
    # DI SINI LOGIKA MACHINE LEARNING ANDA DIMASUKKAN
    # Contoh sederhana:
    input_teks = data.teks
    input_nilai = data.nilai
    
    # ... proses model ML (misal: model.predict()) ...
    hasil_prediksi = f"Prediksi untuk '{input_teks}' selesai."
    skor_akurasi = input_nilai * 0.95
    # ----------------------------------------------------
    
    # Kembalikan hasil dalam bentuk JSON ke Laravel
    return {
        "status": "success",
        "prediksi": hasil_prediksi,
        "skor": skor_akurasi
    }