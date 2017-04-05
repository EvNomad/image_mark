// Get all image elements on page and populate array of predefined images size
var images = $("img").map(function(){
	return (this.naturalWidth > 150 && this.naturalHeight > 150) ? this.currentSrc : null;
}).get();

// Send images to the backgroud script.
// The bookmarks api exposed only in the context of the extension.
chrome.runtime.sendMessage({imgagesArray: images, ext: "imageMark"}, function(response) {
    console.log(response.status);
});