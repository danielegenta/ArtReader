package com.example.android.horizontalpaging;

import android.app.ActionBar;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.FragmentTransaction;
import android.content.ActivityNotFoundException;
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
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

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

        //
        if (tab.getPosition() == 2)
        {
            setContentView(R.layout.fragment_starred);
            popolaLst("starred");
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

    private void testPopolaInfoArtwork()  {
        setContentView(R.layout.fragment_artwork);

        //una delle 3 immagini a caso
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

        ImageView img  = (ImageView)findViewById(R.id.imgArtwork);

        String strJson = "{\"id\":8,\"title\":\"La Gioconda\",\"author\":1,\"abstract\":\"placeholder\",\"pictureUrl\":\"http://1.bp.blogspot.com/-mAlupcNJ_A8/TudH7XRbAEI/AAAAAAAAAco/Cn8Z8lKDYSM/s1600/Leonardo+La+Gioconda+1503+1506.jpg\",\"tecnique\":\"Olio su tavola\",\"year\":1506,\"artMovement\":\"Rinascimento\",\"dimensionHeight\":77,\"dimensionWidth\":53,\"wikipediaPageArtwork\":\"https://it.wikipedia.org/wiki/Gioconda\",\"location\":1,\"pictureUrl2\":\"Artwork8\",\"pictureUrl3\":\"Location1\",\"idLocationsArtworks\":1,\"description\":\"Louvre\",\"city\":\"Parigi\",\"nation\":\"France\",\"wikipediaPageLocation\":\"https://it.wikipedia.org/wiki/Museo_del_Louvre\",\"address\":\"Musée du Louvre, 75001 Paris, France\",\"idAuthor\":1,\"name\":\"Leonardo Da Vinci\n\",\"wikipediaPageAuthor\":\"https://it.wikipedia.org/wiki/Leonardo_da_Vinci\",\"nationalityAuthor\":\"Italia\"}";
        try {
            JSONObject  jsonRootObject = new JSONObject(strJson);


            //popolo campi
            title.setText(jsonRootObject.optString("title"));
            author.setText(Html.fromHtml("<a href=\"" + jsonRootObject.optString("wikipediaPageAuthor") + "\">" + (jsonRootObject.optString("name")) +"</a> "));
            description.setText(jsonRootObject.optString("abstract"));
            tecnique.setText(jsonRootObject.optString("tecnique"));
            year.setText(jsonRootObject.optString("year"));
            artMovement.setText(jsonRootObject.optString("artMovement"));
            dimensions.setText(jsonRootObject.optString("dimensionWidth") + "x" + jsonRootObject.optString("dimensionHeight") );
            info.setText(Html.fromHtml("<a href=\""+jsonRootObject.optString("wikipediaPageArtwork")+"\">Ulteriori Informazioni</a> "));
            location.setText(Html.fromHtml("<a href=\"" + jsonRootObject.optString("wikipediaPageLocation") + "\">" + (jsonRootObject.optString("description")) + "</a> "));
            address.setText(jsonRootObject.optString("address"));

            //dimensioni img


        } catch (JSONException e) {
            e.printStackTrace();
        }

    }

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
            if (resultCode == RESULT_OK) {
                String contents = intent.getStringExtra("SCAN_RESULT");
                String format = intent.getStringExtra("SCAN_RESULT_FORMAT");

                //in content c'è il contenuto del QrCode:
                //es: ArtworkId/Id
                Toast toast = Toast.makeText(this, "Content:" + contents + " Format:" + format, Toast.LENGTH_LONG);

                String[] res = contents.split("/");
                String id = res[1];

                //chiamare api oneArtwork
                //
               // toast = Toast.makeText(this, id, Toast.LENGTH_LONG);
               // toast.show();
            }
        }
    }

    private void popolaLst(String lstType)
    {

        ArrayList<Artwork> listArtworks = new ArrayList<Artwork>();
        ListView lstArt;
        //dati test
        listArtworks.add(new Artwork(1,"La Gioconda", "Leonardo Da Vinci","img1t"));
        listArtworks.add(new Artwork(2,"I Girasoli", "Vincent Van Gogh","img2t"));
        listArtworks.add(new Artwork(3, "L'Ultima Cena", "Leonardo Da Vinci", "img3t"));

        RecordAdapter adapter = new RecordAdapter(this,R.layout.record_layout, listArtworks);

       // lstArt.setOnItemClickListener(listener);
        //pagina cronlogia
        if (lstType.compareTo("history") == 0)
        {
            lstArt = (ListView) findViewById(R.id.lstviewHistory);
            lstArt.setAdapter(adapter);


        }
        //pagina preferiti
        else if (lstType.compareTo("starred") == 0)
        {
            lstArt = (ListView) findViewById(R.id.lstStarred);
            lstArt.setAdapter(adapter);
        }
    }

}
