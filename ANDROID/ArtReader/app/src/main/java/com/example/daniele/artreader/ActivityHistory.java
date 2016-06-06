package com.example.daniele.artreader;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class ActivityHistory extends AppCompatActivity {

    String strHistory, strFavourites, strJson;
    Boolean privateSession;

    ArrayList<Artwork> listHistory = new ArrayList<Artwork>();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_activity_history);


        Bundle b = getIntent().getExtras();
        strHistory  =  b.getString("jsonHistory");
        strFavourites  =  b.getString("jsonFavourites");
        strJson  =  b.getString("jsonArtwork");
        privateSession = b.getBoolean("privateSession");

        try
        {
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
        } catch (JSONException e)
        {
            e.printStackTrace();
        }

        ListView lstArt;
            RecordAdapter adapter = new RecordAdapter(this, R.layout.record_layout, listHistory);
            lstArt = (ListView) findViewById(R.id.listViewHistoryF);
            lstArt.setAdapter(null);
            lstArt.setAdapter(adapter);
            lstArt.setOnItemClickListener(listener);

    }

    ListView.OnItemClickListener listener = new ListView.OnItemClickListener()
    {
        @Override
        public void onItemClick(final AdapterView<?> adapterView, View view,final int pos, long l)
        {
            View v = findViewById(android.R.id.content);
            InviaRichiestaHttp request = new InviaRichiestaHttp(v, ActivityHistory.this)
            {
                @Override
                protected void onPostExecute(String result) {
                    if (result.contains("Exception"))
                        Toast.makeText(ActivityHistory.this, result, Toast.LENGTH_SHORT).show();
                    else
                    {
                        Intent intent = new Intent(getApplicationContext(), ScrollingActivity.class);
                        intent.putExtra("jsonArtwork", result);
                        intent.putExtra("jsonHistory", strHistory);
                        intent.putExtra("jsonFavourites", strFavourites);
                        intent.putExtra("privateSession", privateSession);
                        startActivity(intent);
                    }
                }
            };
            Artwork item = (Artwork)adapterView.getItemAtPosition(pos);
            request.execute("get", "oneArtworkMobile", String.valueOf(item.getID()));
        }
    };
}
