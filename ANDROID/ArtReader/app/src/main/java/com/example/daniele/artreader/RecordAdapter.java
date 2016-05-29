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
 * Created by Daniele on 24/04/16.
 */
public class RecordAdapter extends ArrayAdapter<Artwork> {
    private Context context;
    private int layout_ID;
    private List<Artwork> list;

    //da cambiare ogni volta (come invia richiesta http)
    String myIp = "http://192.168.1.105:8080/";

    public RecordAdapter(Context context, int layout_ID, List<Artwork> objects)
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

        TextView lbl_ID = (TextView) v.findViewById(R.id.lbl_ID);
        TextView lbl_Title = (TextView) v.findViewById(R.id.lbl_Title);
        TextView lbl_Author = (TextView) v.findViewById(R.id.lbl_Author);
        ImageView imageView = (ImageView) v.findViewById(R.id.imageView);

        Artwork artwork = list.get(position);

        lbl_ID.setText(Integer.toString(artwork.getID()));
        lbl_Title.setText(artwork.getTitle());
        lbl_Author.setText(artwork.getAuthor());
        //int resID = context.getResources().getIdentifier(artwork.getImg_path(),"drawable","com.example.daniele.artreader");
        //imageView.setImageResource(resID);

        String imgName = artwork.getImg_path();
        Picasso.with(context).load(myIp +"img/immagini/"+imgName).into(imageView);

        return v;
    }
}
