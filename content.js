// Get all image elements on page and populate array of predefined images size
var images = $("img").map(function(){
	return (this.naturalWidth > 150 && this.naturalHeight > 150) ? this : null;
}).get();

console.log(images);