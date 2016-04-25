package com.example.android.horizontalpaging;

import android.app.ActionBar;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.FragmentTransaction;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.ViewPager;
import android.text.Html;
import android.text.method.LinkMovementMethod;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.Locale;

public class MainActivity extends FragmentActivity implements ActionBar.TabListener {

    /**
     * The {@link android.support.v4.view.PagerAdapter} that will provide
     * fragments for each of the sections. We use a
     * {@link android.support.v4.app.FragmentPagerAdapter} derivative, which
     * will keep every loaded fragment in memory. If this becomes too memory
     * intensive, it may be best to switch to a
     * {@link android.support.v4.app.FragmentStatePagerAdapter}.
     */
    SectionsPagerAdapter mSectionsPagerAdapter;

    /**
     * The {@link ViewPager} that will host the section contents.
     */
    ViewPager mViewPager;
    static final String ACTION_SCAN = "com.google.zxing.client.android.SCAN";

    //strutture cronologia e preferiti
    ArrayList<Artwork> listArtworksHistory = new ArrayList<Artwork>();
    ArrayList<Artwork> listArtworksFavourites= new ArrayList<Artwork>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.sample_main);
        final ActionBar actionBar = getActionBar();
        actionBar.setNavigationMode(ActionBar.NAVIGATION_MODE_TABS);
        mSectionsPagerAdapter = new SectionsPagerAdapter(getSupportFragmentManager());

        // Set up the ViewPager with the sections adapter.
        mViewPager = (ViewPager) findViewById(R.id.pager);
        mViewPager.setAdapter(mSectionsPagerAdapter);
        // END_INCLUDE (setup_view_pager)
        mViewPager.setOnPageChangeListener(new ViewPager.SimpleOnPageChangeListener() {
            @Override
            public void onPageSelected(int position) {
                actionBar.setSelectedNavigationItem(position);
            }
        });
        // END_INCLUDE (page_change_listener)

        // BEGIN_INCLUDE (add_tabs)
        // For each of the sections in the app, add a tab to the action bar.
        for (int i = 0; i < mSectionsPagerAdapter.getCount(); i++) {
            actionBar.addTab(
                    actionBar.newTab()
                            .setText(mSectionsPagerAdapter.getPageTitle(i))
                            .setTabListener(this));
        }
        // END_INCLUDE (add_tabs)

        //popolo le due strutture logiche, lettura file di testo
         popolaStructures();

    }



    /**
     * Update {@link ViewPager} after a tab has been selected in the ActionBar.
     *
     * @param tab Tab that was selected.
     * @param fragmentTransaction A {@link android.app.FragmentTransaction} for queuing fragment operations to
     *                            execute once this method returns. This FragmentTransaction does
     *                            not support being added to the back stack.
     */
    // BEGIN_INCLUDE (on_tab_selected)
    @Override
    public void onTabSelected(ActionBar.Tab tab, FragmentTransaction fragmentTransaction) {
        // When the given tab is selected, tell the ViewPager to switch to the corresponding page.
        mViewPager.setCurrentItem(tab.getPosition());

        //popolo grafica con le strutture già pronte, non leggo da file di testo
        if (tab.getPosition() == 2)
        {
            setContentView(R.layout.fragment_starred);
            popolaLst("favourites");
        }
        else if (tab.getPosition() == 0)
        {
            setContentView(R.layout.fragment_history);
            popolaLst("history");
        }
        else if (tab.getPosition() == 1)
        {
            setContentView(R.layout.fragment_main);
        }
    }
    // END_INCLUDE (on_tab_selected)


/*****************GESTIONE AGGIORNAMENTO CRONOLOGIA E PREFERITI**************/
    private void scriviModifiche(String fileToUpdate)
    {
        if (fileToUpdate.compareTo("history") == 0)
        {
            if (listArtworksHistory.size() > 0) {
                for (Artwork a : listArtworksHistory) {
                    String data = a.getID() + "-" + a.getTitle() + "-" + a.getAuthor() + "-" + a.getImg_path();
                    String filename = "history1.txt";
                    writeToFile(data, filename);
                    RenameAppFile(getApplicationContext(), "history1.txt", "history.txt");

                }
            }
            else
            {
                String data = "";
                String filename = "history1.txt";
                writeToFile(data, filename);
                RenameAppFile(getApplicationContext(), "history1.txt", "history.txt");
            }
        }
        else
        {
            if (listArtworksFavourites.size() > 0)
            {
                for (Artwork a : listArtworksFavourites) {
                    String data = a.getID() + "-" + a.getTitle() + "-" + a.getAuthor() + "-" + a.getImg_path();
                    String filename = "favourites1.txt";
                    writeToFile(data, filename);
                    RenameAppFile(getApplicationContext(), "favourites1.txt", "favourites.txt");
                }
            }
            else
            {
                String data = "";
                String filename = "favourites1.txt";
                writeToFile(data, filename);
                RenameAppFile(getApplicationContext(), "favourites1.txt", "favourites.txt");
            }
        }
    }

    public static void RenameAppFile(Context context, String originalFileName, String newFileName)
    {
        File originalFile = context.getFileStreamPath(originalFileName);
        File newFile = new File(originalFile.getParent(), newFileName);
        if (newFile.exists())
        {
            context.deleteFile(newFileName);
        }
        originalFile.renameTo(newFile);
    }
    /**********************FINE GESTIONE AGGIORNAMENTO*******************/


    /**
     * Unused. Required for {@link android.app.ActionBar.TabListener}.
     */
    @Override
    public void onTabUnselected(ActionBar.Tab tab, FragmentTransaction fragmentTransaction) {
    }

    /**
     * Unused. Required for {@link android.app.ActionBar.TabListener}.
     */
    @Override
    public void onTabReselected(ActionBar.Tab tab, FragmentTransaction fragmentTransaction) {
    }

    public class SectionsPagerAdapter extends FragmentPagerAdapter {

        public SectionsPagerAdapter(FragmentManager fm) {
            super(fm);
        }
        @Override
        public Fragment getItem(int position) {
            // getItem is called to instantiate the fragment for the given page.
            // Return a DummySectionFragment (defined as a static inner class
            // below) with the page number as its lone argument.
            Fragment fragment=null;
            Bundle args = new Bundle();
            if (position == 1)
            {
                fragment = new mainPage();
                args.putInt(mainPage.ARG_SECTION_NUMBER, position + 1);
            }
            else if (position == 0)
            {
                fragment = new historyPage();
                args.putInt(historyPage.ARG_SECTION_NUMBER, position + 1);
            }
            else  if (position == 2)
            {
                fragment = new starredPage();
                args.putInt(starredPage.ARG_SECTION_NUMBER, position + 1);
            }

            fragment.setArguments(args);
            return fragment;
        }
        // END_INCLUDE (fragment_pager_adapter_getitem)

        // BEGIN_INCLUDE (fragment_pager_adapter_getcount)
        /**
         * Get number of pages the {@link ViewPager} should render.
         *
         * @return Number of fragments to be rendered as pages.
         */
        @Override
        public int getCount() {
            // Show 3 total pages.
            return 3;
        }
        @Override
        public CharSequence getPageTitle(int position) {
            Locale l = Locale.getDefault();
            switch (position) {
                case 0:
                    return getString(R.string.title_section1).toUpperCase(l);
                case 1:
                    return getString(R.string.title_section2).toUpperCase(l);
                case 2:
                    return getString(R.string.title_section3).toUpperCase(l);
            }
            return null;
        }
        // END_INCLUDE (fragment_pager_adapter_getpagetitle)

    }

    /*
    * * MAIN
    * */
    public static class mainPage extends Fragment {
        public static final String ARG_SECTION_NUMBER = "section_number";

        public mainPage() {
        }

        @Override
        public View onCreateView(LayoutInflater inflater, ViewGroup container,
                Bundle savedInstanceState) {
            View rootView = inflater.inflate(R.layout.fragment_main, container, false);
            return rootView;
        }
    }

    //PAGINA CRONOLOGIA
    public static class historyPage extends Fragment
    {
        public static final String ARG_SECTION_NUMBER = "section_number";

        public historyPage() {
        }

        @Override
        public View onCreateView(LayoutInflater inflater, ViewGroup container,
                                 Bundle savedInstanceState) {
            View rootView = inflater.inflate(R.layout.fragment_history, container, false);

            return rootView;
        }
    }


    //PAGINA PREFERITI
    public static class starredPage extends Fragment {
        public static final String ARG_SECTION_NUMBER = "section_number";

        public starredPage() {
        }

        @Override
        public View onCreateView(LayoutInflater inflater, ViewGroup container,
                                 Bundle savedInstanceState) {
            View rootView = inflater.inflate(R.layout.fragment_starred, container, false);
            return rootView;
        }
    }


    /******************
     * GESTIONE PREFERITI
     * @param v
     ******************/
    public void setFavourite(View v)
    {
        boolean red = setFavouriteSupport();

        TextView id = (TextView) findViewById(R.id.lblIdArtwork);
        TextView title = (TextView) findViewById(R.id.lblTitleArtwork);
        TextView author = (TextView) findViewById(R.id.lblAuthorArtwork);
        ImageView img = (ImageView) findViewById(R.id.imgArtwork);
        String tmpImg = "img1t";

        Artwork artwork = new Artwork(Integer.parseInt(id.getText().toString()), title.getText().toString(), author.getText().toString(), tmpImg);

        //aggiornare struttura
        //aggiunta a preferiti
        if (red)
        {
            //aggiunta elemento a lstPreferiti
            listArtworksFavourites.add(artwork);
        }
        //rimozione da preferiti
        else
        {
            int index = 0;
            //eliminazione da struttura logica
            for (Artwork a:listArtworksFavourites)
            {
                if (a.getID() == Integer.parseInt(id.getText().toString()))
                    break;
                index++;
            }
            listArtworksFavourites.remove(index);
        }
        scriviModifiche("favourites");
    }

    private boolean setFavouriteSupport()
    {
        ImageView imgFavourite = (ImageView)findViewById(R.id.imgFavourite);
        String tag = (String)imgFavourite.getTag();
        if (tag.compareTo("grey") == 0)
        {
            imgFavourite.setImageResource(R.drawable.favouritered);
            imgFavourite.setTag("red");

            return  true;
        }
        else
        {
            imgFavourite.setImageResource(R.drawable.favouritegrey);
            imgFavourite.setTag("grey");

            return false;
        }
    }
     /***********FINE GESTIONE PREFERITI*******/


    /****
     * Gestione Cronologia
     *
     */

    //ricerco se tale record vi è già in cronologia, se si lo riposiziono al primo posto se no lo aggiungo in testa
    private void addHistoryRecord()
    {
        TextView id = (TextView) findViewById(R.id.lblIdArtwork);
        TextView title = (TextView) findViewById(R.id.lblTitleArtwork);
        TextView author = (TextView) findViewById(R.id.lblAuthorArtwork);
        ImageView img = (ImageView) findViewById(R.id.imgArtwork);
        String tmpImg = "img1t";
        Artwork artwork = new Artwork(Integer.parseInt(id.getText().toString()), title.getText().toString(), author.getText().toString(), tmpImg);
        int index = 0;

        //rimuovo eventuai occorrenze
        for (Artwork a:listArtworksHistory)
        {
            if (a.getID() == Integer.parseInt(id.getText().toString()))
            {
                listArtworksHistory.remove(index);
            }
            index++;
        }

        //aggiungo in testa
        listArtworksHistory.add(0, artwork);
    }

    /********FINE GESTIONE CRONOLOGIA*******/

    /******************PULSANTE SCAN*****************/
    public void scanQR(View v) {
        try
        {
           // Intent intent = new Intent(ACTION_SCAN);
           // intent.putExtra("SCAN_MODE", "QR_CODE_MODE");
           // startActivityForResult(intent, 0);

            testPopolaInfoArtwork();
        }
        catch (ActivityNotFoundException anfe) {
            showDialog(MainActivity.this, "No Scanner Found", "Download a scanner code activity?", "Yes", "No").show();
        }

        //InviaRichiestaHttp http = new InviaRichiestaHttp();
        //http.execute("get", "/allArtworks");

    }
    /*****************FINE PULSANTE SCAN*****************/

    /**************DISPLAY ARTWORK INFO : AFTER SCAN**********************/
    private void testPopolaInfoArtwork()
    {
        setContentView(R.layout.fragment_artwork);

        //una delle 3 immagini a caso
        TextView mainTitle = (TextView)findViewById(R.id.lblMainTitle);
        TextView id = (TextView)findViewById(R.id.lblIdArtwork);
        TextView title = (TextView)findViewById(R.id.lblTitleArtwork);
        TextView author = (TextView)findViewById(R.id.lblAuthorArtwork);
        TextView tecnique = (TextView)findViewById(R.id.lblTecnique);
        TextView dimensions = (TextView)findViewById(R.id.lblDimensions);
        TextView info = (TextView)findViewById(R.id.lblInfo);
        TextView location = (TextView)findViewById(R.id.lblLocation);
        TextView address = (TextView)findViewById(R.id.lblAddress);
        TextView year = (TextView)findViewById(R.id.lblYear);
        TextView artMovement = (TextView)findViewById(R.id.lblArtMovement);
        TextView description = (TextView)findViewById(R.id.lblDescription);

        //per far funzionare i link
        location.setMovementMethod(LinkMovementMethod.getInstance());
        author.setMovementMethod(LinkMovementMethod.getInstance());
        info.setMovementMethod(LinkMovementMethod.getInstance());

        ImageView img  = (ImageView)findViewById(R.id.imgArtwork);

        String strJson = "{\"id\":8,\"title\":\"La Gioconda\",\"author\":1,\"abstract\":\"placeholder\",\"pictureUrl\":\"http://1.bp.blogspot.com/-mAlupcNJ_A8/TudH7XRbAEI/AAAAAAAAAco/Cn8Z8lKDYSM/s1600/Leonardo+La+Gioconda+1503+1506.jpg\",\"tecnique\":\"Olio su tavola\",\"year\":1506,\"artMovement\":\"Rinascimento\",\"dimensionHeight\":77,\"dimensionWidth\":53,\"wikipediaPageArtwork\":\"https://it.wikipedia.org/wiki/Gioconda\",\"location\":1,\"pictureUrl2\":\"Artwork8\",\"pictureUrl3\":\"Location1\",\"idLocationsArtworks\":1,\"description\":\"Louvre\",\"city\":\"Parigi\",\"nation\":\"France\",\"wikipediaPageLocation\":\"https://it.wikipedia.org/wiki/Museo_del_Louvre\",\"address\":\"Musée du Louvre, 75001 Paris, France\",\"idAuthor\":1,\"name\":\"Leonardo Da Vinci\n\",\"wikipediaPageAuthor\":\"https://it.wikipedia.org/wiki/Leonardo_da_Vinci\",\"nationalityAuthor\":\"Italia\"}";
        try
        {
            JSONObject  jsonRootObject = new JSONObject(strJson);

            //popolo campi
            //id.setText(jsonRootObject.optString("id"));
            //messo a 1 per test!!!!!!!!!! decommentare riga sopra!!!!!!!
            id.setText("1");

            title.setText(jsonRootObject.optString("title"));
            mainTitle.setText(jsonRootObject.optString("title"));
            author.setText(Html.fromHtml("<a href=\"" + jsonRootObject.optString("wikipediaPageAuthor") + "\">" + (jsonRootObject.optString("name")) +"</a> "));
            description.setText(jsonRootObject.optString("abstract"));
            tecnique.setText(jsonRootObject.optString("tecnique"));
            year.setText(jsonRootObject.optString("year"));
            artMovement.setText(jsonRootObject.optString("artMovement"));
            dimensions.setText(jsonRootObject.optString("dimensionWidth") + "x" + jsonRootObject.optString("dimensionHeight") );
            info.setText(Html.fromHtml("<a href=\""+jsonRootObject.optString("wikipediaPageArtwork")+"\">Ulteriori Informazioni</a> "));
            location.setText(Html.fromHtml("<a href=\"" + jsonRootObject.optString("wikipediaPageLocation") + "\">" + (jsonRootObject.optString("description")) + "</a> "));
            address.setText(jsonRootObject.optString("address"));

            //verifico se è gia nei preferiti, se sì, cambio colore icona
            for (Artwork a:listArtworksFavourites)
            {
                if (a.getID() == Integer.parseInt(id.getText().toString()))
                {
                    setFavouriteSupport();
                }
            }
            addHistoryRecord();

            //dimensioni img

            //ricerche correlate
            String testJson_RicercheCorrelate = "[{\"id\":6,\"title\":\"L'Ultima Cena\",\"pictureUrl\":\"http://www.scudit.net/mdleonardo_file/cenacolo100.jpg\",\"nViews\":30,\"dimensionHeight\":460,\"dimensionWidth\":880}]";
            JSONArray jsonArray = new JSONArray(testJson_RicercheCorrelate);

            int i = 0;
            JSONObject obj;
            for (i = 0; i < jsonArray.length(); i++) {
                //tolgo la label con nessuna ricerca correlata
                TextView textNoRelatedSearch = (TextView) findViewById(R.id.txtNoRelatedSearch);
                textNoRelatedSearch.setVisibility(View.INVISIBLE);

                obj = jsonArray.getJSONObject(i);
                switch (i) {
                    case 0:
                        loadRelatedSearch(obj, i);
                        break;
                    case 1:
                        loadRelatedSearch(obj, i);
                        break;
                    case 2:
                        loadRelatedSearch(obj, i);
                        break;
                    default:
                        break;
                }
            }

            //aggiorno file!!!!!!
            scriviModifiche("history");
        }
        catch (JSONException e)
        {
            e.printStackTrace();
        }
    }

    private void loadRelatedSearch(JSONObject obj, int index)
    {
        if (index == 0)
        {
            //definisco oggetti che mi servono
            TextView textRelatedSearch1 = (TextView)findViewById(R.id.txtRelatedSearch1);
            ImageView imageRelatedSearch1 = (ImageView) findViewById(R.id.imgRelatedSearch1);

            //setto visibilità
            textRelatedSearch1.setVisibility(View.VISIBLE);
            imageRelatedSearch1.setVisibility(View.VISIBLE);

            //setto attributi
            textRelatedSearch1.setText(obj.optString("title"));

            imageRelatedSearch1.setImageResource(R.drawable.img3t); //immagine di test
             //regolare dimensioni immagine da codice
            imageRelatedSearch1.requestLayout();
            imageRelatedSearch1.getLayoutParams().height = 300;
            imageRelatedSearch1.getLayoutParams().width = 300;
        }
        else if (index == 1)
        {
            //definisco oggetti che mi servono
            TextView textRelatedSearch2 = (TextView)findViewById(R.id.txtRelatedSearch2);
            ImageView imageRelatedSearch2 = (ImageView) findViewById(R.id.imgRelatedSearch2);

            //setto visibilità
            textRelatedSearch2.setVisibility(View.VISIBLE);
            imageRelatedSearch2.setVisibility(View.VISIBLE);

            //setto attributi
            textRelatedSearch2.setText(obj.optString("title"));

            imageRelatedSearch2.setImageResource(R.drawable.img3t); //immagine di test
            //regolare dimensioni immagine da codice
            imageRelatedSearch2.requestLayout();
            imageRelatedSearch2.getLayoutParams().height = 300;
            imageRelatedSearch2.getLayoutParams().width = 300;
        }
        else if (index == 2)
        {
            //definisco oggetti che mi servono
            TextView textRelatedSearch3 = (TextView)findViewById(R.id.txtRelatedSearch1);
            ImageView imageRelatedSearch3 = (ImageView) findViewById(R.id.imgRelatedSearch1);

            //setto visibilità
            textRelatedSearch3.setVisibility(View.VISIBLE);
            imageRelatedSearch3.setVisibility(View.VISIBLE);

            //setto attributi
            textRelatedSearch3.setText(obj.optString("title"));

            imageRelatedSearch3.setImageResource(R.drawable.img3t); //immagine di test
            //regolare dimensioni immagine da codice
            imageRelatedSearch3.requestLayout();
            imageRelatedSearch3.getLayoutParams().height = 300;
            imageRelatedSearch3.getLayoutParams().width = 300;
        }
    }
    /****************************END DISPLAY ARTWORK INFO*****************/

    private static AlertDialog showDialog(final Activity act, CharSequence title, CharSequence message, CharSequence buttonYes, CharSequence buttonNo) {
        AlertDialog.Builder downloadDialog = new AlertDialog.Builder(act);
        downloadDialog.setTitle(title);
        downloadDialog.setMessage(message);
        downloadDialog.setPositiveButton(buttonYes, new DialogInterface.OnClickListener() {
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

    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        if (requestCode == 0)
        {
            if (resultCode == RESULT_OK)
            {
                String contents = intent.getStringExtra("SCAN_RESULT");
                String format = intent.getStringExtra("SCAN_RESULT_FORMAT");

                //in content c'è il contenuto del QrCode:
                //es: ArtworkId/Id
                Toast toast = Toast.makeText(this, "Content:" + contents + " Format:" + format, Toast.LENGTH_LONG);

                String[] res = contents.split("/");
                String id = res[1];

                //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!SOSTITUIRE CON API
                //chiamare api oneArtwork
                //
               // toast = Toast.makeText(this, id, Toast.LENGTH_LONG);
               // toast.show();
            }
        }
    }

    /*************
     * Popolo i due listview CRONOLOGIA e PREFERITI
     * @param lstType
     */
    private void popolaLst(String lstType)
    {
        ListView lstArt;
        if (lstType == "history")
        {
            setContentView(R.layout.fragment_history);


            RecordAdapter adapter = new RecordAdapter(this, R.layout.record_layout, listArtworksHistory);
            lstArt = (ListView) findViewById(R.id.lstviewHistory);
            lstArt.setAdapter(adapter);
            lstArt.setOnItemClickListener(listener);
        }

        else if (lstType == "favourites") {
            setContentView(R.layout.fragment_starred);

            RecordAdapter adapter = new RecordAdapter(this, R.layout.record_layout, listArtworksFavourites);
            lstArt = (ListView) findViewById(R.id.lstStarred);
            lstArt.setAdapter(adapter);
            lstArt.setOnItemClickListener(listener);
        }
    }

    ListView.OnItemClickListener listener = new ListView.OnItemClickListener()
    {
        @Override
        public void onItemClick(AdapterView<?> adapterView, View view, int pos, long l)
        {
            Artwork item = (Artwork) adapterView.getItemAtPosition(pos);

            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!SOSTITUIRE CON API
            testPopolaInfoArtwork();
        }
    };

    //SOLO AL LANCIO leggo i file di testo, poi lavoro sulle struttutre!!!
    private void popolaStructures()
    {
        //cronologia
        String aux = readFromFile("history.txt");
        if (aux != "")
        {
            String righe[] = aux.split(";");
            String[] colonne;
            for (int i = 0; i < righe.length; i++) {
                colonne = righe[i].split("-");
                listArtworksHistory.add(new Artwork(Integer.parseInt(colonne[0]), colonne[1], colonne[2], colonne[3]));
            }
        }

        //preferiti
        String aux1 = readFromFile("favourites.txt");
        if (aux1 != "")
        {
            String righe1[] = aux1.split(";");
            String[] colonne1;
            for (int i = 0; i < righe1.length; i++) {
                colonne1 = righe1[i].split("-");
                listArtworksFavourites.add(new Artwork(Integer.parseInt(colonne1[0]), colonne1[1], colonne1[2], colonne1[3]));
            }
        }

    }


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
        catch (IOException e) {
            Log.e("Exception", "File write failed: " + e.toString());

        }
    }

    private String readFromFile(String filename) {
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

                while ( (receiveString = bufferedReader.readLine()) != null ) {
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

}
/***************FINE GESTIONE FILE TXT**************/
