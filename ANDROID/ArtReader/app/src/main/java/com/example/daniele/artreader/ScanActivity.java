package com.example.daniele.artreader;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Toast;

import com.google.zxing.ResultPoint;
import com.journeyapps.barcodescanner.BarcodeCallback;
import com.journeyapps.barcodescanner.BarcodeResult;
import com.journeyapps.barcodescanner.BarcodeView;

import java.util.List;

/**
 * Created by Daniele on 15/05/16.
 */
public class ScanActivity extends AppCompatActivity implements BarcodeCallback
{

    BarcodeView mBarcodeView;
    String auxHistory, auxFavourites;
    Boolean privateSession;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.scanactivity);

        mBarcodeView = (BarcodeView)findViewById(R.id.barcode);

        Bundle b = getIntent().getExtras();
        auxHistory=  b.getString("jsonHistory");
        auxFavourites  =  b.getString("jsonFavourites");
        privateSession = b.getBoolean("privateSession");
    }

    @Override
    public void onResume() {
        super.onResume();
        mBarcodeView.resume();
        mBarcodeView.decodeSingle(this);
    }

    @Override
    public void onPause() {
        super.onPause();
        mBarcodeView.pause();
    }

    @Override
    public void barcodeResult(BarcodeResult result) {
        ScanAction.exec(this);

        String codeScanned =result.getText();

        //in content c'è il contenuto del QrCode:
        //es: ArtworkId-Title
        String[] res = codeScanned.split("-");
        String id = res[0];


        View v = findViewById(android.R.id.content);
        InviaRichiestaHttp request = new InviaRichiestaHttp(v, ScanActivity.this)
        {
            @Override
            protected void onPostExecute(String result) {
                if (result.contains("Exception"))
                    Toast.makeText(ScanActivity.this, result, Toast.LENGTH_SHORT).show();
                else
                {
                    //richiamo seconda intent passandogli come parametro la stringa json letta
                    Intent intent1 = new Intent(getApplicationContext(), ScrollingActivity.class);
                    intent1.putExtra("jsonArtwork", result);
                    intent1.putExtra("jsonHistory", auxHistory);
                    intent1.putExtra("jsonFavourites", auxFavourites);
                    intent1.putExtra("privateSession", privateSession);
                    startActivity(intent1);
                }
            }
        };
        String par = id;
        request.execute("get", "oneArtworkMobile", par);
    }

    @Override
    public void possibleResultPoints(List<ResultPoint> resultPoints) {

    }
}
