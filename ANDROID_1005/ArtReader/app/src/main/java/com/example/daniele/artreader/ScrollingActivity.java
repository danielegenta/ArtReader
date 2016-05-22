package com.example.daniele.artreader;

import android.annotation.TargetApi;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.media.MediaPlayer;
import android.os.Build;
import android.os.Bundle;
import android.support.design.widget.CollapsingToolbarLayout;
import android.support.design.widget.FloatingActionButton;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.text.Html;
import android.text.method.LinkMovementMethod;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.ArrayList;

public class ScrollingActivity extends AppCompatActivity {

    ArrayList<Artwork> listHistory = new ArrayList<Artwork>();
    ArrayList<Artwork> listFavourites = new ArrayList<Artwork>();
    MediaPlayer mp;
    boolean isAudioPlaying = false;
    boolean privateSession = false;
    int idArtwork;

    String auxTitle = "", auxAuthor= "", auxArtMovement = "";

    String retVal;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_scrolling);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);



        Bundle b = getIntent().getExtras();
        String strHistory  =  b.getString("jsonHistory");
        String strFavourites  =  b.getString("jsonFavourites");
        String strJson  =  b.getString("jsonArtwork");

        privateSession = b.getBoolean("privateSession");

        try
        {
            //JSONObject jObj = new JSONObject(strHistory);
            JSONArray jArr = new JSONArray(strHistory);
            for (int i=0; i < jArr.length(); i++)
            {
                JSONObject obj = jArr.getJSONObject(i);
                int id = obj.getInt("id");
                String title = obj.getString("title");
                String author = obj.getString("author");
                String img = obj.getString("img");
                Artwork a = new Artwork(id, title, author, img);
                listHistory.add(a);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        try
        {
            JSONArray jArr = new JSONArray(strFavourites);
            for (int i=0; i < jArr.length(); i++)
            {
                JSONObject obj = jArr.getJSONObject(i);
                int id = obj.getInt("id");
                String title = obj.getString("title");
                String author = obj.getString("author");
                String img = obj.getString("img");
                Artwork a = new Artwork(id, title, author, img);
                listFavourites.add(a);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }


        initialSettings();
        loadData(strJson);
    }

    @Override
    protected void onStop()
    {
        super.onStop();
        if (mp != null)
            mp.stop();
    }


    private void initialSettings()
    {
        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setTag("grey");
        fab.setImageResource(R.drawable.favouritegrey);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                setFavourite(view);
            }
        });
    }

    /**************DISPLAY ARTWORK INFO : AFTER SCAN**********************/
    @TargetApi(Build.VERSION_CODES.JELLY_BEAN)
    private void loadData(String strJson)
    {
        CollapsingToolbarLayout mainTitle =
                (CollapsingToolbarLayout) findViewById(R.id.toolbar_layout);

        //TextView id = (TextView)findViewById(R.id.lblIdArtwork);
        TextView title = (TextView)findViewById(R.id.lblTitleArtwork);
        TextView author = (TextView)findViewById(R.id.lblAuthorArtwork);
        TextView tecnique = (TextView)findViewById(R.id.lblTecnique);
        TextView dimensions = (TextView)findViewById(R.id.lblDimensions);
        TextView info = (TextView)findViewById(R.id.lblInfo);
        TextView location = (TextView)findViewById(R.id.lblLocation);
        TextView address = (TextView)findViewById(R.id.lblAddress);
        TextView year = (TextView)findViewById(R.id.lblYear);
        TextView artMovement = (TextView)findViewById(R.id.lblArtMovement);
        TextView description = (TextView)findViewById(R.id.lblDescription);
        Toolbar headerImg = (Toolbar) findViewById(R.id.toolbar);

        //per far funzionare i link
        location.setMovementMethod(LinkMovementMethod.getInstance());
        author.setMovementMethod(LinkMovementMethod.getInstance());
        info.setMovementMethod(LinkMovementMethod.getInstance());


        try
        {
            JSONObject jsonRootObject = new JSONObject(strJson);

            //popolo campi
            //id.setText(jsonRootObject.optString("id"));
            //messo a 1 per test!!!!!!!!!! decommentare riga sopra!!!!!!!
            idArtwork = Integer.parseInt(jsonRootObject.optString("id"));

            mainTitle.setTitle(jsonRootObject.optString("title"));
            title.setText(jsonRootObject.optString("title"));
            author.setText(Html.fromHtml("<a href=\"" + jsonRootObject.optString("wikipediaPageAuthor") + "\">" + (jsonRootObject.optString("name")) + "</a> "));
            description.setText(jsonRootObject.optString("abstract"));
            tecnique.setText(jsonRootObject.optString("tecnique"));
            year.setText(jsonRootObject.optString("year"));
            artMovement.setText(jsonRootObject.optString("artMovement"));
            dimensions.setText(jsonRootObject.optString("dimensionWidth") + "x" + jsonRootObject.optString("dimensionHeight") );
            info.setText(Html.fromHtml("<a href=\""+jsonRootObject.optString("wikipediaPageArtwork")+"\">Ulteriori Informazioni</a> "));
            location.setText(Html.fromHtml("<a href=\"" + jsonRootObject.optString("wikipediaPageLocation") + "\">" + (jsonRootObject.optString("description")) + "</a> "));
            address.setText(jsonRootObject.optString("address"));


            //utili per ricerche correlate
            auxTitle = title.getText().toString();
            auxAuthor = jsonRootObject.optString("author"); //mi serve id autore
            auxArtMovement = artMovement.getText().toString();

            //verifico se è gia nei preferiti, se sì, cambio colore icona
            if (listFavourites != null)
            {
                for (Artwork a : listFavourites)
                {
                    if (Integer.valueOf(a.getID()) == Integer.valueOf(idArtwork))
                    {
                        setFavouriteSupport();
                        break;
                    }
                }
            }
            addHistoryRecord();


            loadRelatedSearchMainRequest();
            scriviModifiche("history");
        }
        catch (JSONException e)
        {
            e.printStackTrace();
        }
    }

    private void loadRelatedSearch(JSONObject obj, int index)
    {
        if (index == 0)
        {
            //definisco oggetti che mi servono
            TextView textRelatedSearch1 = (TextView)findViewById(R.id.txtRelatedSearch1);
            ImageView imageRelatedSearch1 = (ImageView) findViewById(R.id.imgRelatedSearch1);

            //setto visibilità
            textRelatedSearch1.setVisibility(View.VISIBLE);
            imageRelatedSearch1.setVisibility(View.VISIBLE);

            //
            String id = obj.optString("id");
            imageRelatedSearch1.setTag(id);

            //setto attributi
            textRelatedSearch1.setText(obj.optString("title"));

            imageRelatedSearch1.setImageResource(R.drawable.img3t); //immagine di test
            //regolare dimensioni immagine da codice
            imageRelatedSearch1.requestLayout();
            imageRelatedSearch1.getLayoutParams().height = 300;
            imageRelatedSearch1.getLayoutParams().width = 300;
        }
        else if (index == 1)
        {
            //definisco oggetti che mi servono
            TextView textRelatedSearch2 = (TextView)findViewById(R.id.txtRelatedSearch2);
            ImageView imageRelatedSearch2 = (ImageView) findViewById(R.id.imgRelatedSearch2);

            //setto visibilità
            textRelatedSearch2.setVisibility(View.VISIBLE);
            imageRelatedSearch2.setVisibility(View.VISIBLE);

            //
            String id = obj.optString("id");
            imageRelatedSearch2.setTag(id);

            //setto attributi
            textRelatedSearch2.setText(obj.optString("title"));

            imageRelatedSearch2.setImageResource(R.drawable.img3t); //immagine di test
            //regolare dimensioni immagine da codice
            imageRelatedSearch2.requestLayout();
            imageRelatedSearch2.getLayoutParams().height = 300;
            imageRelatedSearch2.getLayoutParams().width = 300;
        }
        else if (index == 2)
        {
            //definisco oggetti che mi servono
            TextView textRelatedSearch3 = (TextView)findViewById(R.id.txtRelatedSearch1);
            ImageView imageRelatedSearch3 = (ImageView) findViewById(R.id.imgRelatedSearch1);

            //setto visibilità
            textRelatedSearch3.setVisibility(View.VISIBLE);
            imageRelatedSearch3.setVisibility(View.VISIBLE);

            //
            String id = obj.optString("id");
            imageRelatedSearch3.setTag(id);

            //setto attributi
            textRelatedSearch3.setText(obj.optString("title"));

            imageRelatedSearch3.setImageResource(R.drawable.img3t); //immagine di test
            //regolare dimensioni immagine da codice
            imageRelatedSearch3.requestLayout();
            imageRelatedSearch3.getLayoutParams().height = 300;
            imageRelatedSearch3.getLayoutParams().width = 300;
        }
    }
    /****************************END DISPLAY ARTWORK INFO*****************/

    /******************
     * GESTIONE PREFERITI
     ******************/
    private void addHistoryRecord()
    {
        TextView title = (TextView) findViewById(R.id.lblTitleArtwork);
        TextView author = (TextView) findViewById(R.id.lblAuthorArtwork);
        //ImageView img = (ImageView) findViewById(R.id.imgArtwork);
        String tmpImg = "img1t";
        Artwork artwork = new Artwork(idArtwork, title.getText().toString(), author.getText().toString(), tmpImg);
        int index = 0;

        //rimuovo eventuai occorrenze
        if (listHistory != null)
        {
            for (Artwork a : listHistory)
            {
                if (Integer.valueOf(a.getID()) == Integer.valueOf(idArtwork))
                {
                    listHistory.remove(index);
                    break; //se no errore
                }
                index++;
            }

            //aggiungo in testa
            listHistory.add(0, artwork);
        }
    }

    public void setFavourite(View v)
    {
        boolean red = setFavouriteSupport();
        TextView title = (TextView) findViewById(R.id.lblTitleArtwork);
        TextView author = (TextView) findViewById(R.id.lblAuthorArtwork);
        //ImageView img = (ImageView) findViewById(R.id.imgArtwork);
        String img = "img1t";

        Artwork artwork = new Artwork(idArtwork, title.getText().toString(), author.getText().toString(), img);

        //aggiornare struttura
        //aggiunta a preferiti
        if (red)
        {
            //aggiunta elemento a lstPreferiti
            listFavourites.add(artwork);
        }
        //rimozione da preferiti
        else
        {
            int index = 0;
            //eliminazione da struttura logica
            for (Artwork a:listFavourites)
            {
                if (a.getID() == idArtwork)
                    break;
                index++;
            }
            listFavourites.remove(index);
        }
        scriviModifiche("favourites");
    }

    private boolean setFavouriteSupport()
    {
        //ImageView imgFavourite = (ImageView)findViewById(R.id.imgFavourite);
        FloatingActionButton imgFavourite = (FloatingActionButton)findViewById(R.id.fab);
        String tag = (String)imgFavourite.getTag();
        if (tag.compareTo("grey") == 0)
        {
            imgFavourite.setImageResource(R.drawable.favouritered);
            imgFavourite.setTag("red");

            return  true;
        }
        else
        {
            imgFavourite.setImageResource(R.drawable.favouritegrey);
            imgFavourite.setTag("grey");

            return false;
        }
    }
    /***********FINE GESTIONE PREFERITI*******/

    /*****************GESTIONE AGGIORNAMENTO CRONOLOGIA E PREFERITI**************/
    private void scriviModifiche(String fileToUpdate)
    {
        int index = 0;
        if (fileToUpdate.compareTo("history") == 0)
        {
            if (listHistory != null)
            {
                if (!privateSession)
                {
                    if (listHistory.size() > 0)
                    {
                        String data = "";
                        String filename = "history1.txt";
                        for (Artwork a : listHistory)
                        {
                            if (index == 0)
                                data = a.getID() + "-" + a.getTitle() + "-" + a.getAuthor() + "-" + a.getImg_path();
                            else
                                data += ";"+a.getID() + "-" + a.getTitle() + "-" + a.getAuthor() + "-" + a.getImg_path();
                            index++;
                        }
                        writeToFile(data, filename);
                        RenameAppFile(getApplicationContext(), "history1.txt", "history.txt");
                    }
                    else
                    {
                        String data = "";
                        String filename = "history1.txt";
                        writeToFile(data, filename);
                        RenameAppFile(getApplicationContext(), "history1.txt", "history.txt");
                    }
                }
            }
        }
        else
        {
            if (listFavourites != null)
            {
                if (listFavourites.size() > 0)
                {
                    String data = "";
                    for (Artwork a : listFavourites)
                    {
                        if (index == 0)
                            data = a.getID() + "-" + a.getTitle() + "-" + a.getAuthor() + "-" + a.getImg_path();
                        else
                            data += ";"+a.getID() + "-" + a.getTitle() + "-" + a.getAuthor() + "-" + a.getImg_path();
                        index++;
                    }
                    String filename = "favourites1.txt";
                    writeToFile(data, filename);
                    RenameAppFile(getApplicationContext(), "favourites1.txt", "favourites.txt");
                }
                else
                {
                    String data = "";
                    String filename = "favourites1.txt";
                    writeToFile(data, filename);
                    RenameAppFile(getApplicationContext(), "favourites1.txt", "favourites.txt");
                }
            }
        }
    }

    public static void RenameAppFile(Context context, String originalFileName, String newFileName)
    {
        File originalFile = context.getFileStreamPath(originalFileName);
        File newFile = new File(originalFile.getParent(), newFileName);
        if (newFile.exists())
        {
            context.deleteFile(newFileName);
        }
        originalFile.renameTo(newFile);
    }

    private void writeToFile(String data, String filename)
    {
        try
        {
            Context context = getApplicationContext();
            OutputStreamWriter outputStreamWriter = new OutputStreamWriter(context.openFileOutput(filename, Context.MODE_PRIVATE));


            String auxData [] = data.split(";");
            for (int i = 0; i<auxData.length; i++)
                outputStreamWriter.write(auxData[i] +";");
            outputStreamWriter.close();
        }
        catch (IOException e) {
            Log.e("Exception", "File write failed: " + e.toString());

        }
    }
    /**********************FINE GESTIONE AGGIORNAMENTO*******************/


    //actions buttons
    //map
    public void openMap(View v)
    {
        TextView address = (TextView)findViewById(R.id.lblAddress);
        //passare anche indirizzo
        Intent intent = new Intent(this, MapsActivity.class);
        intent.putExtra("address", address.getText());
        startActivity(intent);
    }

    //audio
    public void openAudio(View v)
    {
        TextView title = (TextView)findViewById(R.id.lbl_Title);
        audioPlayer(title.getText().toString().toLowerCase());
    }

    //feedback
    public void openFeedback(View v)
    {
        Intent intent = new Intent(this, ReviewActivity.class);
        startActivity(intent);
    }

    public void audioPlayer(String fileName)
    {
        if (isAudioPlaying)
        {
            mp.pause();
            isAudioPlaying = false;
        }
        else
        {
            try
            {
                int resID=getResources().getIdentifier(fileName, "raw", getPackageName());
                if (mp == null)
                    mp =MediaPlayer.create(this,resID);
                mp.start();
                isAudioPlaying = true;
            }
            catch (Exception e)
            {
                e.printStackTrace();
            }
        }

    }


    // *****************NOT USED*************
    //CROP IMAGE
    private Bitmap getCroppedBitmap(Bitmap srcBitmap)
    {
        Bitmap destBitmap = null;

        if (srcBitmap.getWidth() <= srcBitmap.getHeight())
        {
            destBitmap = Bitmap.createBitmap(srcBitmap, 0, srcBitmap.getHeight() / 2 - srcBitmap.getWidth() / 2, srcBitmap.getWidth(), srcBitmap.getWidth());
        }

        return destBitmap;
    }
    /*****************************/

    /***
     * Funzioni utilizzate da ricerche correlate
     *
     */

    //click su una delle immagini delle ricerche correlate
    public void relatedSearchClick(View v)
    {
        String id = "";
        if (v.getId() == R.id.imgRelatedSearch1)
        {
            ImageView img1 = (ImageView) findViewById(R.id.imgRelatedSearch1);
            id = img1.getTag().toString();

        }
        else if (v.getId() == R.id.imgRelatedSearch2)
        {
            ImageView img2 = (ImageView) findViewById(R.id.imgRelatedSearch2);
            id = img2.getTag().toString();
        }
        else if (v.getId() == R.id.imgRelatedSearch3)
        {
            ImageView img3 = (ImageView) findViewById(R.id.imgRelatedSearch3);
            id = img3.getTag().toString();
        }
        idArtwork = Integer.valueOf(id);
        loadRelatedSearchRequest(id);
        ScrollView mainScrollView = (ScrollView)findViewById(R.id.scrollView);
        mainScrollView.fullScroll(ScrollView.FOCUS_UP);
    }

    /*
    * * Richieste AJAX per ricerche correlate
    * */
    private void loadRelatedSearchRequest(String id)
    {
        View v = findViewById(android.R.id.content);
        InviaRichiestaHttp request = new InviaRichiestaHttp(v, ScrollingActivity.this)
        {
            @Override
            protected void onPostExecute(String result) {
                if (result.contains("Exception"))
                    Toast.makeText(ScrollingActivity.this, result, Toast.LENGTH_SHORT).show();
                else
                {
                    initialSettings();
                    loadData(result);
                }
            }
        };
        request.execute("get", "oneArtwork", id);
    }

    private void loadRelatedSearchMainRequest()
    {
        //ricerche correlate
        View v = findViewById(android.R.id.content);
        retVal = "nok";
        InviaRichiestaHttp request = new InviaRichiestaHttp(v, ScrollingActivity.this)
        {
            @Override
            protected void onPostExecute(String result) {
                if (result.contains("Exception"))
                {
                    Toast.makeText(ScrollingActivity.this, result, Toast.LENGTH_SHORT).show();
                }
                else
                {
                    //richiamo seconda intent passandogli come parametro la stringa json letta
                    retVal = String.valueOf(result);
                    JSONArray jsonArray = null;
                    if (retVal.compareTo("nok") != 0)
                    {
                        try
                        {
                            jsonArray = new JSONArray(retVal);
                        }
                        catch (JSONException e) {
                            e.printStackTrace();
                        }
                        int i = 0;
                        JSONObject obj = null;
                        for (i = 0; i < jsonArray.length(); i++)
                        {
                            //tolgo la label con nessuna ricerca correlata
                            TextView textNoRelatedSearch = (TextView) findViewById(R.id.txtNoRelatedSearch);
                            textNoRelatedSearch.setVisibility(View.INVISIBLE);
                            try
                            {
                                obj = jsonArray.getJSONObject(i);
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                            switch (i) {
                                case 0:
                                    loadRelatedSearch(obj, i);
                                    break;
                                case 1:
                                    loadRelatedSearch(obj, i);
                                    break;
                                case 2:
                                    loadRelatedSearch(obj, i);
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                }
            }
        };
        String par = "?title=" + auxTitle + "&author=" + auxAuthor + "&artMovement=" + auxArtMovement;
        request.execute("get", "similarArtworks", par);
    }

}
