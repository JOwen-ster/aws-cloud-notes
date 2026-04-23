# how the editor willl work

* first check if the user is authenticated
* then check if the file being request is allowed to be viewed by the user which should already be handled by aws
* get the files url using getUrl amplify function
* fetch the content
* return that content as a string in a json object back to the page to render it into the editor
