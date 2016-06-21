package com.example.daniele.artreader;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.squareup.picasso.Picasso;

import java.util.List;

/**
 * Created by Daniele on 28/05/16.
 */
public class RecordAdapterReview extends ArrayAdapter<Review> {
    private Context context;
    private int layout_ID;
    private List<Review> list;

    //da cambiare ogni volta (come invia richiesta http)
    String myIp = "http://192.168.1.101:8080/";

    public RecordAdapterReview(Context context, int layout_ID, List<Review> objects)
    {
        super(context, layout_ID, objects);

        this.context = context;
        this.layout_ID = layout_ID;
        this.list = objects;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent)
    {
        //Riferimento all'object RecordLayout
        View v = null;
        if(convertView == null)
        {
            //Inflater : oggetto che permette di recuperare un puntatore al layout partendo dal suo id
            LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            v = inflater.inflate(this.layout_ID,parent,false);
        }
        else
            v = convertView;

        TextView lbl_username = (TextView) v.findViewById(R.id.lbl_Username);
        TextView lbl_date = (TextView) v.findViewById(R.id.lbl_Date);
        TextView lbl_title = (TextView) v.findViewById(R.id.lbl_Title);
        TextView lbl_reviewDescription = (TextView) v.findViewById(R.id.lbl_Review);
        ImageView imgUserReview = (ImageView) v.findViewById(R.id.imgUserReview);

        Review review = list.get(position);

        lbl_username.setText(review.getUsername());
        lbl_date.setText(review.getDate());
        lbl_title.setText(review.getTitle());
        lbl_reviewDescription.setText(review.getReview_description());

        String imgName = review.getImg_path();
        Picasso.with(context).load(myIp +"img/users/"+imgName).into(imgUserReview);

        return v;
    }
}
