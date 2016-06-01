package com.example.daniele.artreader;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

/**
 * Created by Daniele on 24/04/16.
 */
public class Lists
{
    public ArrayList<Artwork> getListArtworksHistory() {
        return listArtworksHistory;
    }

    public void setListArtworksHistory(ArrayList<Artwork> listArtworksHistory) {
        this.listArtworksHistory = listArtworksHistory;
    }

    ArrayList<Artwork> listArtworksHistory = new ArrayList<Artwork>();

    public ArrayList<Artwork> getListArtworksFavourites() {
        return listArtworksFavourites;
    }

    public void setListArtworksFavourites(ArrayList<Artwork> listArtworksFavourites) {
        this.listArtworksFavourites = listArtworksFavourites;
    }

    ArrayList<Artwork> listArtworksFavourites= new ArrayList<Artwork>();

    public void addFavouriteRecord(Artwork artwork)
    {
        listArtworksFavourites.add(artwork);
    }

    public void removeFavouriteRecord(Artwork artwork)
    {
    }

    public String historyToString()
    {
        JSONArray jsonArr = new JSONArray();
        //JSONObject jsonObj = new JSONObject();
        for (Artwork a : listArtworksHistory)
        {
            try
            {
                //Artwork a = listArtworksHistory.get(i);
                JSONObject jsonObj = new JSONObject();
                jsonObj.put("id", a.getID());
                jsonObj.put("title", a.getTitle());
                jsonObj.put("author", a.getAuthor());
                jsonObj.put("img", a.getImg_path());
                jsonArr.put(jsonObj);
            }
            catch (JSONException e) {
                e.printStackTrace();
            }
        }
       return jsonArr.toString();
    }

    public String favouritesToString()
    {
        JSONArray jsonArr = new JSONArray();

        for (Artwork a: listArtworksFavourites)
        {
            try
            {
                //Artwork a = listArtworksFavourites.get(i);
                JSONObject jsonObj = new JSONObject();
                jsonObj.put("id", a.getID());
                jsonObj.put("title", a.getTitle());
                jsonObj.put("author", a.getAuthor());
                jsonObj.put("img", a.getImg_path());
                jsonArr.put(jsonObj);
            }
            catch (JSONException e)
            {
                e.printStackTrace();
            }
        }
        return jsonArr.toString();
    }

    public void addHistoryRecord(Artwork artwork)
    {
        listArtworksHistory.add(artwork);
    }
}
