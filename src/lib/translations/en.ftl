
### TRANSLATORS: If Geode is commonly called a different name or spelled 
### differently in your language, you may change it (for example to Геод). 
### However, you should *not* be translating the literal word "Geode" into your 
### language, unless people are genuinely referring to Geode as 
### "Laajentunut imusuoni"!

## Global translations (used everywhere)

nav-home = Home
nav-mods = Mods
nav-language = Language

links-discord = Discord
links-twitter = Twitter
links-bluesky = Bluesky
links-docs = Documentation
links-source-code = Source Code
links-examples = View Examples
links-login = Login
links-logout = Logout

# TRANSLATORS: You may add your name at the end of this :)
# For example: "Translated to English by [HJfod](https://github.com/hjfod) and 
# [Mat](https://github.com/matcool)"
footer-credits = 
    Site made by [HJfod](https://github.com/hjfod). Thank you to 
    {"["}nekit](https://github.com/nekitdev) for the domain!

pagination-current-page = Page {$page} of {$total}
pagination-select-items-per-page = Per page
pagination-showing-mods = Showing {$count} {$count -> 
    [one] mod
   *[other] mods
}
pagination-showing-mods-of-total = Showing {$count} of {$total} {$total -> 
    [one] mod
   *[other] mods
}

## Homepage

# TRANSLATORS: All tags with `meta-` in them are for site metadata, i.e. they 
# might not be visible to users except in things like Google search results
home-meta-title = Geode - Mods for Geometry Dash
home-meta-desc =
    Main page for Geode, the most popular mod loader for 
    Geometry Dash

home-title = Geode
home-subtitle-tagline = Bringing *mod support* to {$gd}

home-button-download = Download
home-button-browse-mods = Browse Mods
home-button-developers = Developers
home-button-faq = FAQ

home-showcase-introduction = 
    Geode is a *fan-made extension* for Geometry Dash 
    that adds *mod support* to the game. Browse from an in-game list to
    seamlessly download mods on *Windows*, *MacOS*, *Android* and *iOS*!

home-showcase-community = 
    Geode is the *most popular* GD mod loader 
    across all platforms. With an active community of both users and modders, 
    nearly every mod you can imagine has been made or suggested!
    .geode-download-count = {$download_count} total downloads
    .mods-published = {$mod_count} mods published

home-showcase-code = 
    Geode is *open-source* and is designed to make the modding 
    experience infinitely smoother for developers. Geode comes 
    with a *special hooking syntax* as well as dozens of built-in *UI 
    components*, *utility functions*, and everything else needed to make mods.
    .comment-include = Include Geode headers
    .comment-modify = Add hooks to the main menu
    .comment-hook-init = Override the main menu creation
    .comment-init-original = Start off by creating the original main menu
    .comment-log = Now we are modding!
    .log-message = Hi from my mod!

home-showcase-get-started = 
    Interested? Go to the *Installation Page* to download Geode 
    for your device, or the *Mods Browser* to view what mods 
    Geode has to offer!

## When a new update is released, the site goes into emergency information mode 
## that explains what's going on

update-emergency-notification-info-broken = 
    A new update for Geometry Dash (version {$new_gd_version}) was recently 
    released, and because of that *Geode is currently broken*. We're working on 
    fixing it, but please be patient!
    .faq-button = What's going on?

update-emergency-notification-info-fixed = 
    A new update for Geometry Dash (version {$new_gd_version}) was recently 
    released. *Geode now supports that version*, but *most mods haven't been 
    updated yet*. Please wait for mod developers to update their mods. 
    .faq-button = What's going on?

# These are shown on the Download page to replace the download button
update-emergency-install-title = Geode is currently unavailable
update-emergency-install-text = 
    {"*"}Every new update to GD breaks Geode.* This is inevitable and due to 
    low-level technical issues. Luckily, we have developed tools over the years 
    that make updating Geode a lot faster and simpler, but it still does 
    require at least a few days of manual labor.
    
    {"*"}We ask you to be patient* while we work on updating Geode. We are just 
    college students developing it on our free time as a hobby. We assure you 
    we aren't being lazy; it's just really hard and time-consuming.
    
    {"*"}For the time being, if Geode is crashing for you, uninstall it.* We 
    will be letting everyone know when it's updated to the latest GD version.
    
    If you want to install Geode for an older version of GD, you can still find 
    older versions on our 
    {"["}GitHub releases page](https://github.com/geode-sdk/geode/releases).

## Download page

download-meta-title = Download Geode
download-meta-desc = 
    Download Geode on Windows, MacOS, Android or iOS

download-title = Download Geode

download-language-warning = 
    Geode itself, including the Android and iOS launchers, are currently *only 
    available in English*.

download-instructions = Installation instructions
    .step-1 = Download the *installer* for the platform you want.
    .step-2 = Run the installer.
    .platform-info = 
        Geode is available for *Windows*, *macOS*, *Android*, *iOS* 
        (experimental) and *Linux* (through Wine).

download-fetch-failed = 
    Could not determine the latest Geode release.

    You can download Geode [here](https://github.com/geode-sdk/geode/releases/latest).
    
    Android users should install 
    {"["}the Android launcher](https://github.com/geode-sdk/android-launcher/releases/latest) 
    instead.

    iOS users should check out 
    {"["}the iOS installation guide](https://github.com/geode-sdk/ios-launcher/blob/main/INSTALL.md)

download-latest-version = Latest version: {$version}
download-latest-android-version = Latest Android Launcher version: {$version}
download-latest-ios-version = Latest iOS Launcher version: {$version}

download-auto-detect-failed = 
    Couldn't auto-detect your platform. You can download Geode for your device 
    below.

download-linux-info = 
    You can install Geode using the command below: 
    {$linux_install_command}
    Or by using the Windows installer *(requires Wine)*.

download-macos-info = 
    The *Geode macOS installer* is only supported on the 
    {"["}Steam]({$steam_link}) release of Geometry Dash.

download-ios-info = 
    Installing Geode on iOS is a bit more complicated than other platforms, 
    and requires the use of a *computer*.

download-linux-faq-link = 
    Click here for an FAQ about installing Geode on Linux.

download-show-all = Show all platforms
download-for-windows = Download for Windows
download-for-macos = Download for macOS
download-for-macos-steam = Download for macOS (Steam)
download-for-android = Download for Android
download-for-ios = Download for iOS
download-for-ios-experimental = Download for iOS (experimental)
download-for-linux = Download for Linux

download-how-to-use-mods-section-title = 
    How to install mods?

download-how-to-use-main-menu = 
    Once you have installed Geode, you should see a *new button* in the bottom row of the main menu.

    Clicking this button brings you to the Geode Menu.
    .button-missing-faq = I can't see the Geode button!
    .image-alt = The main menu, showing the Geode button

download-how-to-use-mods-list = 
    The first page you see is the *list of mods you currently have installed*. 
    Use the toggles to quickly *enable/disable* any mods, or click *View* for 
    further options like editing mod settings and uninstalling.
    .mod-settings-faq = How do I change mod settings?
    .mod-update-faq = How do I update mods?
    .mod-uninstall-faq = How do I uninstall mods?
    .image-alt = The Geode menu, showing the list of installed mods

download-how-to-use-download-mods = 
    The other pages - *Featured*, *Download*, and *Recent* are dedicated to 
    finding new mods. 

    You can use the *search input* to search for specific mods by name, or 
    click the *filters* to find mods based on tags.
    .cant-find-mod-faq = Why can't I find a certain mod?
    .image-alt = The download mods page in Geode

## Mods browser

browser-meta-title = Geode - Mods
browser-meta-desc = 
    Browse mods for the Geode mod loader for Geometry Dash

browser-title = Browse Mods

browser-search = 
    .placeholder = Search mods...

browser-sort = Sort by
    .most-downloaded = Most downloaded
    .recently-published = Recent
    .recently-updated = Recently updated
    .oldest = Oldest
    .name-a-z = Name (A-Z)
    .name-z-a = Name (Z-A)

# TRANSLATORS: $platforms here is either the exact word "geode" if the user has 
# no platform search options enabled, or a list formatted in the selected 
# language of the platforms. To be more specific, the list is a disjunction, as 
# in a "A, B or C" list. If this does not work for your language, please contact 
# HJfod and we will figure it out! 
browser-no-results-found =
    # No matching mods found :(

    It could be that the mod you're looking for is not available on 
    {$platforms -> 
        [geode] Geode, or was made for an older version
       *[a] {$platforms}, or was made for an older version of Geode
    }!

browser-filters-title = Search Filters

browser-filters-category-developer = Developer
browser-filters-developer-own-only = Your mods only

browser-filters-category-platform = Platform

browser-filters-category-tags = Tags
    .list-error = Failed to list tags!
    .server-error = Unable to connect to servers!

browser-filters-category-other = Other
browser-filters-featured-only = Featured only
browser-filters-unverified-only = Unverified only

## FAQ page

faq-meta-title = Geode - FAQ
faq-meta-desc = 
    Frequently Asked Questions (FAQ) about Geode and modding Geometry Dash

faq-title = Frequently Asked Questions

# This category is only shown when GD has recently gotten an update and Geode 
# is still broken for it
faq-category-emergency-update-broken = New GD Update

faq-q-why-is-geode-not-working = 
    .question = Why is Geode not working? Why is my game crashing?
    .answer = 
        {"*"}A new update for GD (update {$new_gd_version}) was recently 
        released.* This update broke Geode for technical reasons. We are 
        working on fixing Geode, but please be patient. While waiting for the 
        update, you can *uninstall Geode for the time being*, or 
        {"*"}[open Geode in safe mode](#what-is-safe-mode)*.

faq-q-when-will-geode-update = 
    .question = When will Geode be updated?
    .answer =
        {"*"}Hopefully in the next few days.* We can't know a more precise 
        answer than that; it depends on a lot of factors out of our control. 
        Sometimes it takes us a few hours, other times a few weeks.


faq-q-why-does-this-happen = 
    .question = Why does this happen every time GD is updated?
    .answer = 
        This is due to technical limitations. Unless RobTop specifically 
        decides to support modding officially, Geode will unfortunately break 
        with every new GD update.

faq-q-why-is-it-taking-so-long = 
    .question = You lazy bums! Why is it taking so long?
    .answer =
        We understand your frustation, but we are just students working on this 
        on our free time as a hobby. We are working as fast as we can, but we 
        only have a few hours of free time in our daily lives, and can't work 
        any faster.

faq-q-will-i-have-to-reinstall-mods = 
    .question = Will I have to reinstall all my mods after Geode is updated?
    .answer = 
        No, although your mods will be unavailable until the developer updates 
        them to the new version. Once they do, you will get a notification 
        in-game that the mod has an update available.

faq-q-where-can-i-find-news = 
    .question = Where can I find out about progress on the Geode update?
    .answer = 
        We post news and updates on our 
        {"["}Discord server](https://discord.gg/9e43WMKzhp) and 
        {"["}Twitter account](https://twitter.com/GeodeSDK).

# This category is only shown when GD has recently gotten an update but Geode 
# now supports it
faq-category-emergency-update-fixed = New GD Update

faq-q-does-geode-work-now = 
    .question = Does Geode work now?
    .answer = 
        Yes! Geode is now working again. You may have to 
        {"["}reinstall it](/download), but automatic updates should take it from 
        there. Do note that *not all mods have yet been ported to the new 
        update* – you may have to wait a while for those still.

faq-q-when-will-mods-be-updated = 
    .question = When will my mods be updated?
    .answer = 
        This depends entirely on the mods' developers. Small & popular mods 
        will probably be ported very soon, but bigger and more complex mods 
        might take a while. Message the developer if you want to learn more, 
        but please remain respectful while doing so!

faq-q-why-did-geode-break = 
    .question = Why did this happen?
    .answer = 
        Due to technical limitations, new GD updates always cause Geode and 
        all mods to break. This is unfortunately unavoidable unless RobTop 
        ever decides to officially support modding.

faq-category-about-geode = About Geode

faq-q-is-geode-official = 
    .question = Is Geode an Official part of GD?
    .answer = 
        Geode is a *fan-made* product, and is not affiliated with nor endorsed 
        by RobTop Games.

faq-q-who-made-geode = 
    .question = Who created Geode?
    .answer = 
        Geode is developed by a team of people, including 
        {"["}HJfod](https://github.com/HJfod/), 
        {"["}Alk](https://github.com/altalk23/), 
        {"["}Mat](https://github.com/matcool/), 
        {"["}Camila314](https://github.com/camila314/), 
        {"["}Cvolton](https://github.com/Cvolton), and others.

faq-q-is-geode-free = 
    .question = Is Geode Free?
    .answer = 
        Geode is *100% free* and always will be! However, individual mods may 
        be paid.

faq-category-common-issues = Common Issues

faq-q-i-cant-see-geode-button = 
    .question = I can't see the Geode button!
    .answer = 
        First of all, make sure you have the latest version of *Geometry Dash* 
        and *Geode*. Then, check if Geode has installed properly.
        
        On Windows, go to your *Geometry Dash folder*, and check if the 
        following files exist: *Geode.dll*, *GeodeUninstaller.exe*, *the geode 
        folder*, *xinput1_4.dll*. You can also check if your *antivirus* has 
        quarantined Geode itself. Don't worry, this is a *false positive*, and 
        you can add an exception for the detected file.
        
        For Android, make sure you also have the latest version of *the 
        launcher*.
        
        If you are trying to install Geode on *Linux*, 
        {"["}go here](#i-am-installing-geode-on-linux-what-do-i-have-to-do).
        
        If all else fails, you can join the 
        {"["}discord server](https://discord.gg/9e43WMKzhp) and open a new help 
        thread.

faq-q-how-do-i-install-geode-on-linux = 
    .question = I am installing Geode on Linux. What do I have to do?
    .answer = 
        Geometry Dash is not available on Linux. However, we can run it easily 
        using [Wine](https://www.winehq.org/), a compatibility layer. Make 
        sure you have it installed, then open the **Windows** version of the 
        installer with Wine. Your root filesystem will appear as the *Z* disk 
        in the installer.
        
        After installation, Geode on Linux requires one extra step to function 
        correctly. You need to set *DLL overrides* for Wine to allow Geode to 
        load properly.
        
        In Steam, right click on *Geometry Dash*, click on *Properties*, and 
        inside *Launch Options* enter the following: 
        `WINEDLLOVERRIDES=\xinput1_4=n,b\ %command%`.
        
        If you are launching Geometry Dash in another way than Steam, then you 
        have to find a way to set *DLL overrides* for your method.

faq-category-using-geode = Using Geode

faq-q-how-do-i-install-mods = 
    .question = How do I install mods?
    .answer = 
        In the main menu of Geometry Dash, you will find a new button in the 
        bottom row which takes you to the *mods list*.
        
        In the mods list, you can find a *Download* tab for searching for mods, 
        and a *Recent* tab for newly released mods. Click on the *View* button 
        on each mod to open their download page, from where you can find the 
        Download button.

faq-q-why-cant-i-find-mods = 
    .question = Why can't I find certain mods?
    .answer = 
        Despite being a cross-platform mod loader, *mods are not always 
        available on all platforms*. This means some mods may not be available 
        on your platform.

faq-q-how-do-i-update-mods = 
    .question = How do I update mods?
    .answer = 
        Geode *automatically checks for updates* for all mods on startup. If 
        updates are found, there will be a blue banner at the top of the *mods 
        list* with a button for updating all mods at once.
        
        To update individual mods, click on the *View* button to open their 
        popup and click *Update*.

faq-q-how-do-i-uninstall-mods = 
    .question = How do I uninstall mods?
    .answer = 
        In the *mods list*, you can click on the *View* button to open the 
        popup for the mod you want to uninstall. There you will find a button 
        to uninstall the mod.

faq-q-how-do-i-change-mod-settings = 
    .question = How do I change mod settings?
    .answer = 
        In the *mods list*, you can click on the *View* button to open the 
        popup for the mod you want to change settings for. There in the 
        {"*"}bottom-left corner* you will find a button to open the *settings 
        dialog*, listing all of the mod's settings.
        
        If the mod is disabled, some settings might not be available.

faq-category-safe-mode = Safe Mode

faq-q-what-is-safe-mode = 
    .question = What is Safe Mode?
    .answer = 
        Safe Mode is an option you can enable when starting Geode. When Geode 
        is running in safe mode, mods aren't loaded at all. This can be useful 
        for disabling a mod, if it is causing the game to crash constantly.

faq-q-how-do-i-enable-safe-mode-win-mac = 
    .question = How do I enable Safe Mode on Windows/Mac?
    .answer = 
        Hold the *Shift* key while launching Geometry Dash. Make sure that you 
        have started holding it before launching, and keep holding it after 
        launch until the game has finished loading.

faq-q-how-do-i-enable-safe-mode-android = 
    .question = How do I enable Safe Mode on Android?
    .answer = 
        Press and hold the *Launch* button in the Geode app.

faq-category-advanced = Advanced Usage

faq-q-how-do-i-manually-install-mods = 
    .question = How do I manually install mods?
    .answer = 
        Locate your Geometry Dash folder, inside of which is a `geode` folder. 
        There you can find a `mods` folder that contains all your Geode mods. 
        To manually install a mod, add the mods' `.geode` files here.
