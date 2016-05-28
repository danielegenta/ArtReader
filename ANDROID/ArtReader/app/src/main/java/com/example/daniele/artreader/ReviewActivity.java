package com.example.daniele.artreader;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Text;

import java.util.ArrayList;
import java.util.List;

public class ReviewActivity extends AppCompatActivity {

    String retVal;
    int idArtwork;
    ArrayList<Review> listReview;
    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_review);

        Bundle b = getIntent().getExtras();
        String title  =  b.getString("titleArtwork");
        idArtwork  =  b.getInt("idArtwork");

        TextView tSubtitle = (TextView)findViewById(R.id.lblSubtitleReview);
        tSubtitle.setText("Recensioni per: \""+title+"\"");

        loadReview();
    }

    public void insertNewReview(View v)
    {
        Intent intent = new Intent(this, NewReview.class);
        startActivity(intent);
    }

    private void loadReview()
    {
        listReview= new ArrayList<Review>();

        View v = findViewById(android.R.id.content);
        retVal = "nok";
        InviaRichiestaHttp request = new InviaRichiestaHttp(v, ReviewActivity.this)
        {
            @Override
            protected void onPostExecute(String result) {
                if (result.contains("Exception"))
                {
                    Toast.makeText(ReviewActivity.this, result, Toast.LENGTH_SHORT).show();
                }
                else
                {
                    //richiamo seconda intent passandogli come parametro la stringa json letta
                    retVal = String.valueOf(result);
                    JSONArray jsonArray;
                    if (retVal.compareTo("nok") != 0)
                    {
                        try
                        {
                            jsonArray = new JSONArray(retVal);
                            JSONObject obj = null;
                            for (int i = 0; i < jsonArray.length(); i++)
                            {
                                try
                                {
                                    obj = jsonArray.getJSONObject(i);
                                    String img = "user.png";
                                    String username = obj.optString("username");
                                    String date = obj.optString("dateReview");
                                    String title = obj.optString("title");
                                    String description = obj.optString("description");
                                    listReview.add(new Review(username, title, date, img, description));
                                }
                                catch (JSONException e) {
                                    e.printStackTrace();
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
        String par = "?idArtwork="+idArtwork;
        request.execute("get", "getFeedback", par);




        //

        RecordAdapterReview adapter = new RecordAdapterReview(this, R.layout.record_layout_newreview, listReview);
        ListView listviewReviews = (ListView) findViewById(R.id.listViewReviews);
        listviewReviews.setAdapter(null);
        listviewReviews.setAdapter(adapter);
        //listviewReviews.setOnItemClickListener(listener);

    }
}
