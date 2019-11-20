var vids;
function load() {
    vids = document.getElementsByTagName( "video" );
}
function hoverVideo( k ) {
    vids[ k ].load();
    vids[ k ].play();
}
function hideVideo( k ) {
    vids[ k ].pause();
}