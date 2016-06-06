package com.example.daniele.artreader;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.ClipData;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.design.widget.AppBarLayout;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.ContextThemeWrapper;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TableLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.Console;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.Random;

public class MainActivity extends AppCompatActivity {

    private SectionsPagerAdapter mSectionsPagerAdapter;

    /**
     * The {@link ViewPager} that will host the section contents.
     */
    private ViewPager mViewPager;

    Lists myLists = null;
    static final String ACTION_SCAN = "com.google.zxing.client.android.SCAN";
    boolean privateSession = false;

    String retVal;
    ArrayList<Artwork> listVerticalArtworks = new ArrayList<Artwork>();
    ArrayList<Artwork>listHorizontalArtworks = new ArrayList<Artwork>();

    String myIp = "http://192.168.1.101:8080/";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        // Create the adapter that will return a fragment for each of the three
        // primary sections of the activity.
        mSectionsPagerAdapter = new SectionsPagerAdapter(getSupportFragmentManager());

        // Set up the ViewPager with the sections adapter.
        mViewPager = (ViewPager) findViewById(R.id.container);
        mViewPager.setAdapter(mSectionsPagerAdapter);
        mViewPager.addOnPageChangeListener(new ViewPager.OnPageChangeListener() {
            // This method will be invoked when the current page is scrolled
            @Override
            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {

            }

            @Override
            public void onPageSelected(int position) {
                if (position == 0) {
                    loadListView("history");
                }
                if (position == 2) {
                    loadListView("favourites");
                }
                if (position == 1)
                {
                    if (myLists != null)
                    {
                        loadLatestViewed();
                        loadAdvice();
                        loadDynamicLayout();
                    }
                }
            }

            @Override
            public void onPageScrollStateChanged(int state) {

            }
        });
        mViewPager.setCurrentItem(0);

        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                scanQR();
            }
        });
        myLists = new Lists();
        loadStructures();


    }

    //SOLO AL LANCIO leggo i file di testo, poi lavoro sulle struttutre!!!
    private void loadStructures()
    {
        myLists.listArtworksHistory.clear();
        myLists.listArtworksFavourites.clear();
        //cronologia
        String aux = readFromFile("history.txt");
        if (aux != "")
        {
            String righe[] = aux.split(";");
            String[] colonne;
            for (int i = 0; i < righe.length; i++)
            {
                colonne = righe[i].split("-");
                myLists.addHistoryRecord((new Artwork(Integer.parseInt(colonne[0]), colonne[1], colonne[2], colonne[3])));
            }
        }

        //preferiti
        String aux1 = readFromFile("favourites.txt");
        if (aux1 != "")
        {
            String righe1[] = aux1.split(";");
            String[] colonne1;
            for (int i = 0; i < righe1.length; i++)
            {
                colonne1 = righe1[i].split("-");
                myLists.addFavouriteRecord((new Artwork(Integer.parseInt(colonne1[0]), colonne1[1], colonne1[2], colonne1[3])));
            }
        }

    }

    /*****************
    /*****************
     //  GESTIONE DEI FILE CRONOLOGIA E PREFERITI
     /*****************/
    private void writeToFile(String data, String filename)
    {
        try
        {
            Context context = getApplicationContext();
            OutputStreamWriter outputStreamWriter = new OutputStreamWriter(context.openFileOutput(filename, Context.MODE_PRIVATE));

            outputStreamWriter.write(data);
            outputStreamWriter.close();
        }
        catch (IOException e)
        {
            Log.e("Exception", "File write failed: " + e.toString());
        }
    }

    private String readFromFile(String filename)
    {
        String ret = "";
        try
        {
            InputStream inputStream = openFileInput(filename);

            if ( inputStream != null )
            {
                InputStreamReader inputStreamReader = new InputStreamReader(inputStream);
                BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
                String receiveString = "";
                StringBuilder stringBuilder = new StringBuilder();

                while ( (receiveString = bufferedReader.readLine()) != null )
                {
                    stringBuilder.append(receiveString);
                }

                inputStream.close();
                ret = stringBuilder.toString();
            }
            //CREO IL FILE
            else
            {
                writeToFile("", filename);
            }
        }
        catch (FileNotFoundException e)
        {
            Log.e("login activity", "File not found: " + e.toString());
        } catch (IOException e)
        {
            Log.e("login activity", "Can not read file: " + e.toString());
        }
        return ret;
    }
    /***************FINE GESTIONE FILE TXT**************/

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item)
    {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        // Handle item selection
        switch (item.getItemId())
        {
            case R.id.action_private:
                managePrivateSession();
                return true;
            case R.id.action_deleteHistory:
                deleteHistory();
                return true;
            case R.id.action_history:
                openHistory();
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }

        //return super.onOptionsItemSelected(item);
    }

    /**
     * A placeholder fragment containing a simple view.
     */
    public static class PlaceholderFragment extends Fragment {
        /**
         * The fragment argument representing the section number for this
         * fragment.
         */
        private static final String ARG_SECTION_NUMBER = "section_number";

        public PlaceholderFragment()
        {
        }

        /**
         * Returns a new instance of this fragment for the given section
         * number.
         */
        public static PlaceholderFragment newInstance(int sectionNumber)
        {
            PlaceholderFragment fragment = new PlaceholderFragment();
            Bundle args = new Bundle();
            args.putInt(ARG_SECTION_NUMBER, sectionNumber);
            fragment.setArguments(args);
            return fragment;
        }

        @Override
        public View onCreateView(LayoutInflater inflater, ViewGroup container,
                                 Bundle savedInstanceState) {
            int nPage = getArguments().getInt(ARG_SECTION_NUMBER);
            View rootView = null;

            //main
            if (nPage == 2)
            {
                rootView = inflater.inflate(R.layout.fragment_main, container, false);

            }
            //history
            else if (nPage == 1)
            {
                rootView = inflater.inflate(R.layout.fragment_history, container, false);
            }

            //favourite
            else if (nPage == 3)
            {
                rootView = inflater.inflate(R.layout.fragment_favourite, container, false);
            }
            return rootView;
        }
    }

    /**
     * A {@link FragmentPagerAdapter} that returns a fragment corresponding to
     * one of the sections/tabs/pages.
     */
    public class SectionsPagerAdapter extends FragmentPagerAdapter {

        public SectionsPagerAdapter(FragmentManager fm) {
            super(fm);
        }

        @Override
        public Fragment getItem(int position) {
            // getItem is called to instantiate the fragment for the given page.
            // Return a PlaceholderFragment (defined as a static inner class below).
            return PlaceholderFragment.newInstance(position + 1);
        }

        @Override
        public int getCount() {
            // Show 3 total pages.
            return 3;
        }

        @Override
        public CharSequence getPageTitle(int position) {
            switch (position) {
                case 0:
                    return "SECTION 1";
                case 1:

                    return "SECTION 2";
                case 2:
                    return "SECTION 3";
            }
            return null;
        }
    }

    public void scanQR()
    {
        try
        {
            Intent intent = new Intent(this,ScanActivity.class);
            intent.putExtra("jsonHistory", myLists.historyToString());
            intent.putExtra("jsonFavourites", myLists.favouritesToString());
            intent.putExtra("privateSession", privateSession);
            startActivity(intent);
        }
        catch (ActivityNotFoundException anfe)
        {
            showDialog(MainActivity.this, "No Scanner Found", "Download a scanner code activity?", "Yes", "No").show();
        }
    }

    @Override
    protected void onResume()
    {
        super.onResume();
        if (myLists != null)
        {
            loadStructures();
            if (mViewPager.getCurrentItem() == 0)
            {
                loadListView("history");
            }
            else if (mViewPager.getCurrentItem() == 2)
            {
                loadListView("favourites");
            }
            else if (mViewPager.getCurrentItem() == 1)
            {
                loadLatestViewed();
                loadAdvice();
                loadDynamicLayout();
                //TextView t1 = (TextView)findViewById(R.id.lblHomeLatestViewed);
                //t1.setText("ok");

            }
        }
    }


    /*****************FINE PULSANTE SCAN*****************/

    private static AlertDialog showDialog(final Activity act, CharSequence title, CharSequence message, CharSequence buttonYes, CharSequence buttonNo) {
        AlertDialog.Builder downloadDialog = new AlertDialog.Builder(act);
        downloadDialog.setTitle(title);
        downloadDialog.setMessage(message);
        downloadDialog.setPositiveButton(buttonYes, new DialogInterface.OnClickListener()
        {
            public void onClick(DialogInterface dialogInterface, int i) {
                Uri uri = Uri.parse("market://search?q=pname:" + "com.google.zxing.client.android");
                Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                try {
                    act.startActivity(intent);
                } catch (ActivityNotFoundException anfe) {

                }
            }
        });
        downloadDialog.setNegativeButton(buttonNo, new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialogInterface, int i) {
            }
        });
        return downloadDialog.show();
    }

    /*************
     * Popolo i due listview CRONOLOGIA e PREFERITI
     * @param lstType
     */
    private void loadListView(String lstType)
    {
        ListView lstArt;
         if (lstType == "favourites")
        {
            RecordAdapter adapter = new RecordAdapter(this, R.layout.record_layout, myLists.listArtworksFavourites);
            lstArt = (ListView) findViewById(R.id.listViewFavourite);
            lstArt.setAdapter(null);
            lstArt.setAdapter(adapter);
            lstArt.setOnItemClickListener(listener);
        }
    }

    ListView.OnItemClickListener listener = new ListView.OnItemClickListener()
    {
        @Override
        public void onItemClick(final AdapterView<?> adapterView, View view,final int pos, long l)
        {
            //String strJson = "{\"id\":8,\"title\":\"La Gioconda\",\"author\":1,\"abstract\":\"placeholder\",\"pictureUrl\":\"http://1.bp.blogspot.com/-mAlupcNJ_A8/TudH7XRbAEI/AAAAAAAAAco/Cn8Z8lKDYSM/s1600/Leonardo+La+Gioconda+1503+1506.jpg\",\"tecnique\":\"Olio su tavola\",\"year\":1506,\"artMovement\":\"Rinascimento\",\"dimensionHeight\":77,\"dimensionWidth\":53,\"wikipediaPageArtwork\":\"https://it.wikipedia.org/wiki/Gioconda\",\"location\":1,\"pictureUrl2\":\"Artwork8\",\"pictureUrl3\":\"Location1\",\"idLocationsArtworks\":1,\"description\":\"Louvre\",\"city\":\"Parigi\",\"nation\":\"France\",\"wikipediaPageLocation\":\"https://it.wikipedia.org/wiki/Museo_del_Louvre\",\"address\":\"Musée du Louvre, 75001 Paris, France\",\"idAuthor\":1,\"name\":\"Leonardo Da Vinci\n\",\"wikipediaPageAuthor\":\"https://it.wikipedia.org/wiki/Leonardo_da_Vinci\",\"nationalityAuthor\":\"Italia\"}";

            View v = findViewById(android.R.id.content);
            InviaRichiestaHttp request = new InviaRichiestaHttp(v, MainActivity.this)
            {
                @Override
                protected void onPostExecute(String result) {
                    if (result.contains("Exception"))
                        Toast.makeText(MainActivity.this, result, Toast.LENGTH_SHORT).show();
                    else
                    {

                        Intent intent = new Intent(getApplicationContext(), ScrollingActivity.class);
                        intent.putExtra("jsonArtwork", result);
                        intent.putExtra("jsonHistory", myLists.historyToString());
                        intent.putExtra("jsonFavourites", myLists.favouritesToString());
                        intent.putExtra("privateSession", privateSession);
                        startActivity(intent);
                    }
                }
            };
            Artwork item = (Artwork)adapterView.getItemAtPosition(pos);
            request.execute("get", "oneArtworkMobile", String.valueOf(item.getID()));
        }
    };

    /*
    * * TOP MENU'
    * */

    //non salvo cronologia
    public void managePrivateSession()
    {
        View view= this.findViewById(android.R.id.content).getRootView();
        Toolbar toolbar = (Toolbar)findViewById(R.id.toolbar);
        AppBarLayout appbar = (AppBarLayout)findViewById(R.id.appbar);
        //mostrare interazione con utente
        if(privateSession)
        {
            privateSession = false;
            Snackbar.make(view, "Sessione Privata DISATTIVA", Snackbar.LENGTH_LONG)
                    .setAction("Action", null).show();

            toolbar.setBackgroundColor(android.graphics.Color.parseColor("#EE6E73"));
            appbar.setBackgroundColor(android.graphics.Color.parseColor("#EE6E73"));


        }
        else
        {
            Snackbar.make(view, "Sessione Privata ATTIVA", Snackbar.LENGTH_LONG)
                    .setAction("Action", null).show();
            privateSession = true;

            //modificare colore status bar
            toolbar.setBackgroundColor(android.graphics.Color.parseColor("#000000"));
            appbar.setBackgroundColor(android.graphics.Color.parseColor("#000000"));
        }
    }

    //cancello cronologia
    public void deleteHistory()
    {
        View view= this.findViewById(android.R.id.content).getRootView();
        File originalFile = getApplicationContext().getFileStreamPath("history.txt");
        File newFile = new File(originalFile.getParent(), "history.txt");
        if (newFile.exists())
        {
            getApplicationContext().deleteFile("history.txt");
            loadStructures();
        }
        originalFile.renameTo(newFile);

        if (mViewPager.getCurrentItem() == 0)
        {
            loadListView("history");
        }

        Snackbar.make(view, "Cronologia Cancellata", Snackbar.LENGTH_LONG)
                .setAction("Action", null).show();

    }


    public void openHistory()
    {
        Intent intent = new Intent(this, ActivityHistory.class);
        intent.putExtra("jsonHistory", myLists.historyToString());
        intent.putExtra("jsonFavourites", myLists.favouritesToString());
        intent.putExtra("privateSession", privateSession);
        startActivity(intent);
    }

    /*
    * * NEW HOME
    * **/
    private void loadLatestViewed()
    {
        if (myLists != null) {
            if (myLists.listArtworksHistory.size() > 0) {
                ImageView imgLatestViewed1 = (ImageView) findViewById(R.id.imgHomeRecent1);
                TextView txtLatestViewed1 = (TextView) findViewById(R.id.txtHomeRecent1);
                imgLatestViewed1.setVisibility(View.VISIBLE);
                txtLatestViewed1.setVisibility(View.VISIBLE);
                Picasso.with(getApplicationContext()).load(myIp + "img/immagini/" + myLists.listArtworksHistory.get(0).getImg_path().toString()).into(imgLatestViewed1);
                imgLatestViewed1.getLayoutParams().height = 300;
                imgLatestViewed1.getLayoutParams().width = 300;
                txtLatestViewed1.setText(myLists.listArtworksHistory.get(0).getTitle().toString());

            }
            if (myLists.listArtworksHistory.size() > 1) {
                ImageView imgLatestViewed2 = (ImageView) findViewById(R.id.imghomeRecent2);
                TextView txtLatestViewed2 = (TextView) findViewById(R.id.txtHomeRecent2);
                imgLatestViewed2.setVisibility(View.VISIBLE);
                txtLatestViewed2.setVisibility(View.VISIBLE);
                Picasso.with(getApplicationContext()).load(myIp + "img/immagini/" + myLists.listArtworksHistory.get(1).getImg_path().toString()).into(imgLatestViewed2);
                imgLatestViewed2.getLayoutParams().height = 300;
                imgLatestViewed2.getLayoutParams().width = 300;
                txtLatestViewed2.setText(myLists.listArtworksHistory.get(1).getTitle().toString());
            }
            if (myLists.listArtworksHistory.size() > 2) {
                ImageView imgLatestViewed3 = (ImageView) findViewById(R.id.imgHomeRecent3);
                TextView txtLatestViewed3 = (TextView) findViewById(R.id.txtHomeRecent3);
                imgLatestViewed3.setVisibility(View.VISIBLE);
                txtLatestViewed3.setVisibility(View.VISIBLE);
                Picasso.with(getApplicationContext()).load(myIp + "img/immagini/" + myLists.listArtworksHistory.get(2).getImg_path().toString()).into(imgLatestViewed3);
                imgLatestViewed3.getLayoutParams().height = 300;
                imgLatestViewed3.getLayoutParams().width = 300;
                txtLatestViewed3.setText(myLists.listArtworksHistory.get(2).getTitle().toString());
            }

            if (myLists.listArtworksHistory.size() == 0) {
                TableLayout tlHomeLatestViewed = (TableLayout) findViewById(R.id.tableLayoutHomeLatestViewed);
                TextView tHomeLatestViewed = (TextView) findViewById(R.id.lblHomeLatestViewed);

                tlHomeLatestViewed.setVisibility(View.GONE);
                tHomeLatestViewed.setVisibility(View.GONE);
            }
        }
    }

    private void loadAdvice()
    {
        if (myLists != null)
        {
        //registro autore più piaciuto e ricerco opere correlate ad esso
        if (myLists.listArtworksFavourites.size() > 0) {
            String cAuthor = "";
            int cntAuthor = 0;
            int cntMax = 0;
            String favAuth = myLists.listArtworksFavourites.get(0).getAuthor();
            for (Artwork a : myLists.listArtworksFavourites) {
                if (a.getAuthor() != cAuthor) {
                    if (cntAuthor > cntMax) {
                        favAuth = cAuthor;
                        cntMax = cntAuthor;
                    }
                    cntAuthor = 0;
                } else {
                    cAuthor = a.getAuthor();
                    cntAuthor++;
                }
            }

            //chiamata http
            homeHttpRequestAdvice(favAuth);
        }
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
        InviaRichiestaHttp request = new InviaRichiestaHttp(v, MainActivity.this)
        {
            @Override
            protected void onPostExecute(String result) {
                if (result.contains("Exception"))
                {
                    Toast.makeText(MainActivity.this, result, Toast.LENGTH_SHORT).show();
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
        //chiamata all artworks
        View v = findViewById(android.R.id.content);retVal = "nok";
        InviaRichiestaHttp request = new InviaRichiestaHttp(v, MainActivity.this)
        {
            @Override
            protected void onPostExecute(String result) {
                if (result.contains("Exception"))
                {
                    Toast.makeText(MainActivity.this, result, Toast.LENGTH_SHORT).show();
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
                LinearLayout.LayoutParams LLParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
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
                    imageView3.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
                    myLayoutH.addView(imageView3);

                }
                else if (n == 1 && i2 < listVerticalArtworks.size())
                {
                    myLayoutH.setPadding(100, 0,0,100);
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
