package com.example.daniele.artreader;

import android.content.Context;
import android.os.AsyncTask;
import android.view.View;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;

/**
 * Created by Daniele on 11/05/16.
 */
public class InviaRichiestaHttp extends AsyncTask<String,Void,String>
{
    View v;
    Context context;
    public InviaRichiestaHttp(View v,Context context)
    {
        this.v = v;
        this.context = context;
    }

    @Override
    protected String doInBackground(String... args) {
        String metodo =  args[0];
        String risorsa =  args[1];
        String par = args[2];


        String ris = "";

        URLConnection conn = null;
        String url = "http://192.168.1.104:8080/";
        url += risorsa;
        try
        {
            if(metodo == "get" )
            {
                if (risorsa.compareTo("allArtworks") == 0 || risorsa.compareTo("getLocations") == 0 )
                {
                    //nessun parametro
                }
                //spostare IN POST!
                else if (risorsa.compareTo("loginmobile") == 0)
                {
                    //username;password
                    String aux [] = par.split(";");
                    url += "?username="+aux[0]+"&password="+aux[1];
                }
                else if (risorsa.compareTo("oneArtwork") == 0)
                {
                    //username;password
                    url += "?id="+par;
                }
                else if (risorsa.compareTo("similarArtworks") == 0 || risorsa.compareTo("getArtworksFromLocation") == 0)
                {
                    url += par;
                }
                URL _url = new URL(url);
                conn = _url.openConnection();
            }
            else if (metodo == "post")
            {

                URL _url = new URL(url);
                conn = _url.openConnection();
            }
            BufferedReader reader = new BufferedReader(new InputStreamReader((conn.getInputStream())));
            String riga="";
            while((riga=reader.readLine())!=null)
            {
                ris+=riga;
            }
            reader.close();
        }
        catch (Exception ex)
        {
            ris = ex.toString();
        }
        return ris;
    }
}
