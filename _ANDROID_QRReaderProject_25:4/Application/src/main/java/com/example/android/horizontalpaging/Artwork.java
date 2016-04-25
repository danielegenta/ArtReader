package com.example.android.horizontalpaging;

/**
 * Created by Daniele on 05/04/16.
 */
public class Artwork {
    private String title;
    private String author;
    private String img_path;
    private int ID;

    public Artwork( int ID, String title, String author, String img_path)
    {
        this.title = title;
        this.author = author;
        this.img_path = img_path;
        this.ID = ID;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getImg_path() {
        return img_path;
    }

    public void setImg_pathw(String img_path) {
        this.img_path = img_path;
    }

    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
    }

}
