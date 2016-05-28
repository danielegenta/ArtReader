package com.example.daniele.artreader;

/**
 * Created by Daniele on 28/05/16.
 */
public class Review
{
    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getImg_path() {
        return img_path;
    }

    public void setImg_path(String img_path) {
        this.img_path = img_path;
    }

    public String getReview_description() {
        return review_description;
    }

    public void setReview_description(String review_description) {
        this.review_description = review_description;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    private String username;
    private String date;
    private String img_path;
    private String review_description;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    private String title;

    public Review(String username,String title, String date, String img_path, String review_description)
    {
        this.username = username;
        this.date = date;
        this.img_path = img_path;
        this.review_description = review_description;
        this.title = title;
    }

}
