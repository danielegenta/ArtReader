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
import android.widget.TextView;

import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class NewHome2 extends AppCompatActivity {

    String auxHistory, auxFavourites; boolean privateSession;

    /*
    *TMP
     */
    ArrayList<Artwork> listHistory = new ArrayList<Artwork>();
    ArrayList<Artwork> listFavourites = new ArrayList<Artwork>();

    String myIp = "http://192.168.1.102:8080/";
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
            txtLatestViewed1.setText(listHistory.get(0).getTitle().toString());
        }
        if (listHistory.size() > 1)
        {
            ImageView imgLatestViewed2 = (ImageView) findViewById(R.id.imghomeRecent2);
            TextView txtLatestViewed2 = (TextView) findViewById(R.id.txtHomeRecent2);
            imgLatestViewed2.setVisibility(View.VISIBLE);
            txtLatestViewed2.setVisibility(View.VISIBLE);
            Picasso.with(getApplicationContext()).load(myIp +"img/immagini/"+listHistory.get(1).getImg_path().toString()).into(imgLatestViewed2);
            txtLatestViewed2.setText(listHistory.get(1).getTitle().toString());
        }
        if (listHistory.size() > 2)
        {
            ImageView imgLatestViewed3 = (ImageView) findViewById(R.id.imgHomeRecent3);
            TextView txtLatestViewed3 = (TextView) findViewById(R.id.txtHomeRecent3);
            imgLatestViewed3.setVisibility(View.VISIBLE);
            txtLatestViewed3.setVisibility(View.VISIBLE);
            Picasso.with(getApplicationContext()).load(myIp +"img/immagini/"+listHistory.get(2).getImg_path().toString()).into(imgLatestViewed3);
            txtLatestViewed3.setText(listHistory.get(2).getTitle().toString());
        }

        //fare controlli per i margini

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
        }
        else
        {
            //mostro gli ultimi 3 quadri inseriti
        }
    }


    private void loadDynamicLayout()
    {
        LinearLayout myLayoutH = new LinearLayout(this);
        myLayoutH.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams LLParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 500);
        myLayoutH.setLayoutParams(LLParams);
        LinearLayout myLayout=((LinearLayout) findViewById(R.id.dynamicTable));
        myLayout.addView(myLayoutH);

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
        ImageView imageView3 = new ImageView(this);
        imageView3.setImageResource(R.drawable.img3t);
        imageView3.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 500));
        myLayoutH.addView(imageView3);

    }

    public void scanQRHome(View v)
    {
        try
        {
            Intent intent = new Intent(this,ScanActivity.class);

           /* intent.putExtra("jsonHistory", myLists.historyToString()); TMP
            intent.putExtra("jsonFavourites", myLists.favouritesToString());*/

            intent.putExtra("privateSession", privateSession);
            startActivity(intent);
        }
        catch (ActivityNotFoundException anfe)
        {
            //showDialog(MainActivity.this, "No Scanner Found", "Download a scanner code activity?", "Yes", "No").show();
        }
    }

}
