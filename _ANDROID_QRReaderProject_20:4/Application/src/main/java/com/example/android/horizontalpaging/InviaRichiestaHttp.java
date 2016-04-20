package com.example.android.horizontalpaging;

import android.content.Context;
import android.os.AsyncTask;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;

/**
 * Created by Daniele on 03/04/16.
 */
public class InviaRichiestaHttp extends AsyncTask<String, Void, String>
{
    private View v;
    private Context context;
    private String url = "localhost:8080";
    private String risorsa;

    //costruttore
    public InviaRichiestaHttp() //(View v, Context context)
    {
        //this.v = v;
       // this.context = context;
    }

    protected String doInBackground(String[]args)
    {
        String ris = "";
        String metodo = args[0];
        String risorsa = args[1];
     //   String parametro = args[2];

        URLConnection conn = null;
        try
        {

            if (metodo == "get")
            {
                url += ""; //parametri
                URL _url = new URL(url);
                conn = _url.openConnection();
            }
            else if (metodo == "post")
            {
                URL _url = new URL(url);

                //aggiunta parametri
                //...
                String data = "";

                conn.setDoOutput(true);
                OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream());
                wr.write(data);
                wr.flush();
                wr.close();
            }

            //lettura risposta
            BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            ris = reader.readLine();
            reader.close();
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return ris;
    }

    @Override
    protected void onPostExecute(String result)
    {
       // TextView txtRis = (TextView)v;
       // txtRis.setText(result);
        result += "ok";
     /*   Toast t = t;
        t.makeText(InviaRichiestaHttp.this, "", Toast.LENGTH_SHORT);
        t.show();
        t.makeText(this, result, Toast.LENGTH_SHORT);*/
    }
}
