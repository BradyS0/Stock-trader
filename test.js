// var pass1 = "yey"
// var pass2 = "yey"
// console.log(pass1==pass2)

function getAsciiCodes(str) {
var codes = [];
for (var i = 0; i < str.length; i++) {
    codes.push(str.charCodeAt(i));
}
return codes;
}

// Example usage
var asciiCodes = getAsciiCodes("{}");
console.log(asciiCodes);

// var a = '{"APPL":{"stockID":"AAPL","name":"Apple"}, "MICR":{"stockID":"MICR","name":"Microsoft"}, "INTL":{"stockID":"INTL","name":"Intel"}}'
// a = JSON.parse(a)
// // a=a["data"]
// for(var i in a)
//     console.log(a[i]["name"])
// console.log(!("n" in a))

// var c = "{}"
// console.log(c)

