<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ContactController;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('services')->group(function () {
    Route::get('/web-development', function () {
        return view('services.development');
    })->name('services.development');
    
    Route::get('/data-analytics', function () {
        return view('services.data');
    })->name('services.data');
});

Route::prefix('case-studies')->group(function () {
    Route::get('/nebula', function () {
        return view('case-studies.nebula');
    })->name('case-studies.nebula');
    
    Route::get('/prism', function () {
        return view('case-studies.prism');
    })->name('case-studies.prism');
    
    Route::get('/vertex', function () {
        return view('case-studies.vertex');
    })->name('case-studies.vertex');
    
    Route::get('/nova', function () {
        return view('case-studies.nova');
    })->name('case-studies.nova');
});

Route::get('/portfolio', function () {
    return view('portfolio');
});

Route::get('/contact', function () {
    return view('contact');
});

// Terima pengiriman form kontak dari halaman kontak
Route::post('/contact', [ContactController::class, 'store'])->name('contact.send');

// Route untuk menghubungkan ke Microservice ML (Python)
Route::get('/ml/predict', [App\Http\Controllers\MlController::class, 'getPrediction'])->name('ml.predict');