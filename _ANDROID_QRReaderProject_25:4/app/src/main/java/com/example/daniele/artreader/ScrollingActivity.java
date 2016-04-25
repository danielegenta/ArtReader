package com.example.daniele.artreader;

import android.content.Context;
import android.os.Bundle;
import android.support.design.widget.CollapsingToolbarLayout;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.text.Html;
import android.text.method.LinkMovementMethod;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

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

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_scrolling);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                finish();
            }
        });

        Bundle b = getIntent().getExtras();
      //  listHistory = (ArrayList<Artwork>) b.getSerializable("listHistory");
      //  listFavourites = (ArrayList<Artwork>) b.getSerializable("listFavourites");
        String strHistory  =  b.getString("jsonHistory");
        String strFavourites  =  b.getString("jsonFavourites");
        String strJson  =  b.getString("jsonArtwork");

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



        loadData(strJson);
    }

    public void closeActivity(View v)
    {

    }

    /**************DISPLAY ARTWORK INFO : AFTER SCAN**********************/
    private void loadData(String strJson)
    {
        CollapsingToolbarLayout mainTitle =
                (CollapsingToolbarLayout) findViewById(R.id.toolbar_layout);

        TextView id = (TextView)findViewById(R.id.lblIdArtwork);
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
            id.setText("1");

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

            //verifico se è gia nei preferiti, se sì, cambio colore icona
            if (listFavourites != null)
            {
                for (Artwork a : listFavourites) {
                    if (a.getID() == Integer.parseInt(id.getText().toString())) {
                        setFavouriteSupport();
                    }
                }
            }
            addHistoryRecord();

            //ricerche correlate
            String testJson_RicercheCorrelate = "[{\"id\":6,\"title\":\"L'Ultima Cena\",\"pictureUrl\":\"http://www.scudit.net/mdleonardo_file/cenacolo100.jpg\",\"nViews\":30,\"dimensionHeight\":460,\"dimensionWidth\":880}]";
            JSONArray jsonArray = new JSONArray(testJson_RicercheCorrelate);

            int i = 0;
            JSONObject obj;
            for (i = 0; i < jsonArray.length(); i++) {
                //tolgo la label con nessuna ricerca correlata
                TextView textNoRelatedSearch = (TextView) findViewById(R.id.txtNoRelatedSearch);
                textNoRelatedSearch.setVisibility(View.INVISIBLE);

                obj = jsonArray.getJSONObject(i);
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

            //aggiorno file!!!!!!
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
        TextView id = (TextView) findViewById(R.id.lblIdArtwork);
        TextView title = (TextView) findViewById(R.id.lblTitleArtwork);
        TextView author = (TextView) findViewById(R.id.lblAuthorArtwork);
        //ImageView img = (ImageView) findViewById(R.id.imgArtwork);
        String tmpImg = "img1t";
        Artwork artwork = new Artwork(Integer.parseInt(id.getText().toString()), title.getText().toString(), author.getText().toString(), tmpImg);
        int index = 0;

        //rimuovo eventuai occorrenze
        if (listHistory != null)
        {
            for (Artwork a : listHistory) {
                if (a.getID() == Integer.parseInt(id.getText().toString())) {
                    listHistory.remove(index);
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

        TextView id = (TextView) findViewById(R.id.lblIdArtwork);
        TextView title = (TextView) findViewById(R.id.lblTitleArtwork);
        TextView author = (TextView) findViewById(R.id.lblAuthorArtwork);
        //ImageView img = (ImageView) findViewById(R.id.imgArtwork);
        String tmpImg = "img1t";

        Artwork artwork = new Artwork(Integer.parseInt(id.getText().toString()), title.getText().toString(), author.getText().toString(), tmpImg);

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
                if (a.getID() == Integer.parseInt(id.getText().toString()))
                    break;
                index++;
            }
            listFavourites.remove(index);
        }
        scriviModifiche("favourites");
    }

    private boolean setFavouriteSupport()
    {
        ImageView imgFavourite = (ImageView)findViewById(R.id.imgFavourite);
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
        if (fileToUpdate.compareTo("history") == 0)
        {
            if (listHistory != null) {
                if (listHistory.size() > 0) {
                    for (Artwork a : listHistory) {
                        String data = a.getID() + "-" + a.getTitle() + "-" + a.getAuthor() + "-" + a.getImg_path();
                        String filename = "history1.txt";
                        writeToFile(data, filename);
                        RenameAppFile(getApplicationContext(), "history1.txt", "history.txt");

                    }
                } else {
                    String data = "";
                    String filename = "history1.txt";
                    writeToFile(data, filename);
                    RenameAppFile(getApplicationContext(), "history1.txt", "history.txt");
                }
            }
        }
        else
        {
            if (listFavourites != null)
            {
                if (listFavourites.size() > 0) {
                    for (Artwork a : listFavourites) {
                        String data = a.getID() + "-" + a.getTitle() + "-" + a.getAuthor() + "-" + a.getImg_path();
                        String filename = "favourites1.txt";
                        writeToFile(data, filename);
                        RenameAppFile(getApplicationContext(), "favourites1.txt", "favourites.txt");
                    }
                } else {
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

            outputStreamWriter.write(data);
            outputStreamWriter.close();
        }
        catch (IOException e) {
            Log.e("Exception", "File write failed: " + e.toString());

        }
    }
    /**********************FINE GESTIONE AGGIORNAMENTO*******************/


}
