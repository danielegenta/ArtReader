package com.example.daniele.artreader;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TableLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Text;

import java.util.ArrayList;
import java.util.IllegalFormatCodePointException;
import java.util.Random;

public class NewHome2 extends AppCompatActivity {

    String auxHistory, auxFavourites; boolean privateSession;
    String retVal;
    /*
    *TMP
     */
    ArrayList<Artwork> listHistory = new ArrayList<Artwork>();
    ArrayList<Artwork> listFavourites = new ArrayList<Artwork>();

    //usati in tabella dinamica
    ArrayList<Artwork>listVerticalArtworks = new ArrayList<Artwork>();
    ArrayList<Artwork>listHorizontalArtworks = new ArrayList<Artwork>();

    String myIp = "http://192.168.1.103:8080/";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_new_home2);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                /*Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();*/
            }
        });

        Bundle b = getIntent().getExtras();
        auxHistory=  b.getString("jsonHistory");
        auxFavourites  =  b.getString("jsonFavourites");
        privateSession = b.getBoolean("privateSession");

        /*
        * TMP
        * */
        try
        {
            JSONArray jArr = new JSONArray(auxHistory);
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
        } catch (JSONException e)
        {
            e.printStackTrace();
        }

        try
        {
            JSONArray jArr = new JSONArray(auxFavourites);
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
        } catch (JSONException e)
        {
            e.printStackTrace();
        }




        /***FINE TMP*******/

        loadLatestViewed();
        loadAdvice();

        loadDynamicLayout();
    }


    private void loadLatestViewed()
    {
        if (listHistory.size() > 0)
        {
            ImageView imgLatestViewed1 = (ImageView) findViewById(R.id.imgHomeRecent1);
            TextView txtLatestViewed1 = (TextView) findViewById(R.id.txtHomeRecent1);
            imgLatestViewed1.setVisibility(View.VISIBLE);
            txtLatestViewed1.setVisibility(View.VISIBLE);
            Picasso.with(getApplicationContext()).load(myIp +"img/immagini/"+listHistory.get(0).getImg_path().toString()).into(imgLatestViewed1);
            imgLatestViewed1.getLayoutParams().height = 300;
            imgLatestViewed1.getLayoutParams().width = 300;
            txtLatestViewed1.setText(listHistory.get(0).getTitle().toString());

        }
        if (listHistory.size() > 1)
        {
            ImageView imgLatestViewed2 = (ImageView) findViewById(R.id.imghomeRecent2);
            TextView txtLatestViewed2 = (TextView) findViewById(R.id.txtHomeRecent2);
            imgLatestViewed2.setVisibility(View.VISIBLE);
            txtLatestViewed2.setVisibility(View.VISIBLE);
            Picasso.with(getApplicationContext()).load(myIp +"img/immagini/"+listHistory.get(1).getImg_path().toString()).into(imgLatestViewed2);
            imgLatestViewed2.getLayoutParams().height = 300;
            imgLatestViewed2.getLayoutParams().width = 300;
            txtLatestViewed2.setText(listHistory.get(1).getTitle().toString());
        }
        if (listHistory.size() > 2)
        {
            ImageView imgLatestViewed3 = (ImageView) findViewById(R.id.imgHomeRecent3);
            TextView txtLatestViewed3 = (TextView) findViewById(R.id.txtHomeRecent3);
            imgLatestViewed3.setVisibility(View.VISIBLE);
            txtLatestViewed3.setVisibility(View.VISIBLE);
            Picasso.with(getApplicationContext()).load(myIp +"img/immagini/"+listHistory.get(2).getImg_path().toString()).into(imgLatestViewed3);
            imgLatestViewed3.getLayoutParams().height = 300;
            imgLatestViewed3.getLayoutParams().width = 300;
            txtLatestViewed3.setText(listHistory.get(2).getTitle().toString());
        }

        if (listHistory.size()==0)
        {
            TableLayout tlHomeLatestViewed = (TableLayout)findViewById(R.id.tableLayoutHomeLatestViewed);
            TextView tHomeLatestViewed = (TextView)findViewById(R.id.lblHomeLatestViewed);

            tlHomeLatestViewed.setVisibility(View.GONE);
            tHomeLatestViewed.setVisibility(View.GONE);
        }

    }

    private void loadAdvice()
    {
        //registro autore più piaciuto e ricerco opere correlate ad esso
        if (listFavourites.size() > 0)
        {
            String cAuthor = "";
            int cntAuthor = 0; int cntMax = 0;
            String favAuth = listFavourites.get(0).getAuthor();
            for (Artwork a :listFavourites)
            {
                if (a.getAuthor() != cAuthor)
                {
                    if (cntAuthor > cntMax)
                    {
                        favAuth = cAuthor;
                        cntMax = cntAuthor;
                    }
                    cntAuthor = 0;
                }
                else
                {
                    cAuthor = a.getAuthor();
                    cntAuthor ++;
                }
            }

            //chiamata http
            homeHttpRequestAdvice(favAuth);
        }
        else
        {
            //nascondo consigli per te
            TableLayout tlHomeAdvice = (TableLayout)findViewById(R.id.tableLayoutHomeAdvice);
            TextView tHomeAdvice = (TextView)findViewById(R.id.lblHomeAdivce);

            tlHomeAdvice.setVisibility(View.GONE);
            tHomeAdvice.setVisibility(View.GONE);
        }
    }

    private void homeHttpRequestAdvice(String author)
    {
        View v = findViewById(android.R.id.content);retVal = "nok";
        InviaRichiestaHttp request = new InviaRichiestaHttp(v, NewHome2.this)
        {
            @Override
            protected void onPostExecute(String result) {
                if (result.contains("Exception"))
                {
                    Toast.makeText(NewHome2.this, result, Toast.LENGTH_SHORT).show();
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
                            int i = 0;
                            JSONObject obj = null;
                            for (i = 0; i < jsonArray.length(); i++)
                            {
                                try
                                {
                                    obj = jsonArray.getJSONObject(i);
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                                switch (i)
                                {
                                    case 0:
                                        loadAdviceFinal(obj, i);
                                        break;
                                    case 1:
                                        loadAdviceFinal(obj, i);
                                        break;
                                    case 2:
                                        loadAdviceFinal(obj, i);
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                        catch (JSONException e) {
                            e.printStackTrace();
                        }

                    }
                }
            }
        };
        String par = "?author=" + author;
        request.execute("get", "artworkAdvice", par);
    }

    private void loadAdviceFinal(JSONObject obj, int index)
    {
        if (index == 0)
        {
            //definisco oggetti che mi servono
            TextView textAdvice1 = (TextView)findViewById(R.id.txtHomeAdvice1);
            ImageView imageAdvice1 = (ImageView) findViewById(R.id.imgHomeAdvice1);

            //setto visibilità
            textAdvice1.setVisibility(View.VISIBLE);
            imageAdvice1.setVisibility(View.VISIBLE);

            //
            String id = obj.optString("id");
            imageAdvice1.setTag(id);

            //setto attributi
            textAdvice1.setText(obj.optString("title"));
            String imgName = obj.optString("pictureUrl");
            Picasso.with(getApplicationContext()).load(myIp +"img/immagini/"+imgName).into(imageAdvice1);

            //regolare dimensioni immagine da codice
            imageAdvice1.requestLayout();
            imageAdvice1.getLayoutParams().height = 300;
            imageAdvice1.getLayoutParams().width = 300;
        }
        else if (index == 1)
        {
            //definisco oggetti che mi servono
            TextView textAdvice2 = (TextView)findViewById(R.id.txtHomeAdvice2);
            ImageView imageAdivce2 = (ImageView) findViewById(R.id.imgHomeAdvice2);

            //setto visibilità
            textAdvice2.setVisibility(View.VISIBLE);
            imageAdivce2.setVisibility(View.VISIBLE);

            //
            String id = obj.optString("id");
            imageAdivce2.setTag(id);

            //setto attributi
            textAdvice2.setText(obj.optString("title"));
            String imgName = obj.optString("pictureUrl");
            Picasso.with(getApplicationContext()).load(myIp +"img/immagini/"+imgName).into(imageAdivce2);

            //regolare dimensioni immagine da codice
            imageAdivce2.requestLayout();
            imageAdivce2.getLayoutParams().height = 300;
            imageAdivce2.getLayoutParams().width = 300;
        }
        else if (index == 2)
        {
            //definisco oggetti che mi servono
            TextView textAdvice3 = (TextView)findViewById(R.id.txtHomeAdvice3);
            ImageView imageAdvice3 = (ImageView) findViewById(R.id.imgHomeAdvice3);

            //setto visibilità
            textAdvice3.setVisibility(View.VISIBLE);
            imageAdvice3.setVisibility(View.VISIBLE);

            //
            String id = obj.optString("id");
            imageAdvice3.setTag(id);

            //setto attributi
            textAdvice3.setText(obj.optString("title"));
            String imgName = obj.optString("pictureUrl");
            Picasso.with(getApplicationContext()).load(myIp +"img/immagini/"+imgName).into(imageAdvice3);

            //regolare dimensioni immagine da codice
            imageAdvice3.requestLayout();
            imageAdvice3.getLayoutParams().height = 300;
            imageAdvice3.getLayoutParams().width = 300;
        }
    }



    private void loadDynamicLayout()
    {
       /* LinearLayout myLayoutH = new LinearLayout(this);
        myLayoutH.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams LLParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 500);
        myLayoutH.setLayoutParams(LLParams);
        LinearLayout myLayout=((LinearLayout) findViewById(R.id.dynamicTable));
        myLayout.addView(myLayoutH);*/

        //due immagini sullo stesso piano
        /*ImageView imageView = new ImageView(this);
        imageView.setImageResource(R.drawable.img1t);
        imageView.setLayoutParams(new LinearLayout.LayoutParams(500, 500));
        myLayoutH.addView(imageView);

        ImageView imageView2 = new ImageView(this);
        imageView2.setImageResource(R.drawable.img2t);
        imageView2.setLayoutParams(new LinearLayout.LayoutParams(500, 500));
        myLayoutH.addView(imageView2);*/

        //un'immagine orizzontale


        //chiamata all artworks
        View v = findViewById(android.R.id.content);retVal = "nok";
        InviaRichiestaHttp request = new InviaRichiestaHttp(v, NewHome2.this)
        {
            @Override
            protected void onPostExecute(String result) {
                if (result.contains("Exception"))
                {
                    Toast.makeText(NewHome2.this, result, Toast.LENGTH_SHORT).show();
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
                            int i = 0;
                            JSONObject obj = null;
                            for (i = 0; i < jsonArray.length(); i++)
                            {
                                try
                                {
                                    obj = jsonArray.getJSONObject(i);
                                    String height = obj.getString("dimensionHeight");
                                    String width = obj.getString("dimensionWidth");
                                    Artwork a = new Artwork(Integer.valueOf(obj.getString("id")),obj.getString("title"),obj.getString("author"),obj.getString("pictureUrl"));
                                    if (Float.valueOf(height) >= Float.valueOf(width))
                                        listVerticalArtworks.add(a);
                                    else
                                        listHorizontalArtworks.add(a);
                                }
                                catch (JSONException e)
                                {
                                    e.printStackTrace();
                                }
                            }
                            loadDynamicLayoutFinal();
                        }
                        catch (JSONException e) {
                            e.printStackTrace();
                        }

                    }
                }
            }
        };
        String par = null;
        request.execute("get", "allArtworks", par);
    }

    private void loadDynamicLayoutFinal()
    {
        //definizione layout
        LinearLayout myLayout=((LinearLayout) findViewById(R.id.dynamicTable));


        int index=0;
        int i1 = 0, i2 = 0;
        if (listHorizontalArtworks.size() > 0 && listVerticalArtworks.size() > 0)
        {



            while (index < (listHorizontalArtworks.size() + listVerticalArtworks.size()))
            {
                LinearLayout myLayoutH = new LinearLayout(this);
                myLayoutH.setOrientation(LinearLayout.HORIZONTAL);
                LinearLayout.LayoutParams LLParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 500);
                myLayoutH.setLayoutParams(LLParams);


                Random rnd = new Random();
                int n = rnd.nextInt(2+1)-1;

                //orizzontali, ne metto 2 in fila
                if (n == 0 && i1 < listHorizontalArtworks.size())
                {
                    myLayout.addView(myLayoutH);
                    Artwork a = listHorizontalArtworks.get(i1);
                    index++;
                    i1++;
                    ImageView imageView3 = new ImageView(this);
                    Picasso.with(getApplicationContext()).load(myIp +"img/immagini/"+a.getImg_path()).into(imageView3);
                    imageView3.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 400));
                    myLayoutH.addView(imageView3);

                }
                else if (n == 1 && i2 < listVerticalArtworks.size())
                {
                    myLayout.addView(myLayoutH);
                    Artwork a = listVerticalArtworks.get(i2);
                    i2++;
                    index++;
                    ImageView imageView = new ImageView(this);
                    Picasso.with(getApplicationContext()).load(myIp +"img/immagini/"+a.getImg_path()).into(imageView);
                    imageView.setLayoutParams(new LinearLayout.LayoutParams(400, 400));
                    myLayoutH.addView(imageView);
                    if (i2 < listVerticalArtworks.size())
                    {
                        a = listVerticalArtworks.get(i2);
                        ImageView imageView2 = new ImageView(this);
                        Picasso.with(getApplicationContext()).load(myIp +"img/immagini/"+a.getImg_path()).into(imageView2);
                        imageView2.setLayoutParams(new LinearLayout.LayoutParams(400, 400));
                        myLayoutH.addView(imageView2);
                        index++;
                        i2++;
                    }
                    //lavoro sul margine
                    else
                    {

                    }
                }
                else if (i2 >= listVerticalArtworks.size() && i1 >= listHorizontalArtworks.size())
                    index = listVerticalArtworks.size() + listHorizontalArtworks.size();
            }
        }
    }
}
