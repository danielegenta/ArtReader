package com.example.daniele.artreader;


import android.content.Context;
import android.media.MediaPlayer;
import android.os.Vibrator;
import android.widget.Toast;


public class ScanAction
{
    public static void exec(Context context) {
        Toast.makeText(context, "QR Code scanned!", Toast.LENGTH_SHORT).show();

        Vibrator vibrator = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
        vibrator.vibrate(200);

        MediaPlayer player = MediaPlayer.create(context, R.raw.beep);
        player.start();
    }
}
