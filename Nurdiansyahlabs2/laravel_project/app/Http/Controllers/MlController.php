<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http; // Wajib dipanggil untuk HTTP Client

class MlController extends Controller
{
    public function getPrediction(Request $request)
    {
        // 1. Siapkan data yang akan dikirim ke Python (bisa didapat dari inputan form user)
        $dataKirim = [
            'teks' => 'Data dari web Nurdiansyahlabs',
            'nilai' => 100.5
        ];

        try {
            // 2. Lakukan request POST ke Microservice Python (Port 8001)
            $response = Http::post('http://127.0.0.1:8001/predict', $dataKirim);

            // 3. Cek apakah Python membalas dengan sukses (Status 200)
            if ($response->successful()) {
                $hasil = $response->json(); // Ubah balasan JSON menjadi Array PHP
                
                // Tampilkan hasil (sementara kita return array untuk melihat outputnya)
                return response()->json([
                    'pesan' => 'Berhasil terhubung ke Python ML!',
                    'data_dari_python' => $hasil
                ]);
            } else {
                return response()->json(['error' => 'Gagal mendapatkan prediksi dari server ML'], 500);
            }

        } catch (\Exception $e) {
            // 4. Tangkap error jika server Python mati/tidak jalan
            return response()->json([
                'error' => 'Microservice ML sedang offline.',
                'detail' => $e->getMessage()
            ], 500);
        }
    }
}