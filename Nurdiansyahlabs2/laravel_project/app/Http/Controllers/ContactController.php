<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:191',
            'email' => 'required|email|max:191',
            'subject' => 'nullable|string|max:191',
            'message' => 'required|string'
        ]);

        try {
            $path = storage_path('app/contacts.json');
            $contacts = [];
            if (file_exists($path)) {
                $contents = file_get_contents($path);
                $contacts = json_decode($contents, true) ?? [];
            }

            $entry = array_merge($data, [
                'received_at' => now()->toDateTimeString(),
                'ip' => $request->ip()
            ]);

            $contacts[] = $entry;
            file_put_contents($path, json_encode($contacts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

            // Log singkat untuk administrator
            Log::info('New contact submission', $entry);

            return redirect()->back()->with('status', 'Terima kasih — pesan Anda sudah kami terima. Kami akan menghubungi Anda segera.');
        } catch (\Exception $e) {
            Log::error('Contact store error: ' . $e->getMessage());
            return redirect()->back()->withErrors('Terjadi kesalahan saat menyimpan pesan. Silakan coba lagi nanti.');
        }
    }
}
