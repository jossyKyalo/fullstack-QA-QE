//JavaScript String Practice Questions
//Question one:- Check String Input
function is_string(input) {
    return typeof input === 'string';
}
console.log(is_string('w3resource'));
console.log(is_string([1, 2, 4, 0]));

//Question two:- Check blank string
function is_Blank(str) {
    return str == '';
}
console.log(is_Blank(''));
console.log(is_Blank('abc'));

//Question three:-String to Array of words
function string_to_array(str) {
    return str.split(' ');
}
console.log(string_to_array("Robin Singh"));

//Question four:- extract characters
function truncate_string(str, num) {
    return str.substring(0, num);
}
console.log(truncate_string("Robin Singh", 4));

//Question five:-Abbreviate Name
function abbrev_name(name) {
    let parts = name.split(" ");
    return parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : name;
}
console.log(abbrev_name("Robin Singh"));

//Question six: -Hide Email Address
function protect_email(address) {
    let [name, domain] = address.split("@");
    return name.substring(0, 5) + '...' + '@' + domain;
}
console.log(protect_email("robin_singh@example.com"));

//Question seven:- Parameterize String
function string_parameterize(str) {
    let lowerStr = str.toLowerCase();
    let parameterizedStr = lowerStr.replace(/[\s]+/g, '-')
        .replace(/[^a-z0-9-]+/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
    return parameterizedStr
}
console.log(string_parameterize("Robin Singh from USA."));

//Question eight: - Capitalize First Letter
function capitalize(str) {
    return str.toUpperCase().charAt(0) + str.slice(1);
}
console.log(capitalize('js string exercises'));

//Question nine: -Capitalize Each word
function capitalize_Words(str) {
    const words = str.split(" ");
    const capitalizedWords = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    const capitalizedSentence = capitalizedWords.join(" ");
    return capitalizedSentence;
}
console.log(capitalize_Words('js string exercises'));

//Question ten: -Swap Case
function swapcase(str) {
    let swappedStr = ' ';
    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        if (char === char.toUpperCase()) {
            swappedStr += char.toLowerCase();
        } else {
            swappedStr += char.toUpperCase();
        }
    }
    return swappedStr;
}
console.log(swapcase('AaBbc'));

//Question eleven:- Camelize String
function camelize(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
        .join('')
}
console.log(camelize("JavaScript Exercises"));

//Question twelve:- Uncamelize string
function uncamelize(str,separator=' ') {
    return str
          .replace(/([a-z])([A-Z])/g, '$1' + separator + '$2')   
          .toLowerCase();      

}
console.log(uncamelize("helloWorld",'-'));
//Question thirteen: - Repeat String
function repeat(word, numOfTimes) {
    return word.repeat(numOfTimes);
}
console.log(repeat('Ha!', 3));

//Question fourteen: -Insert in String
function insert(originalString, stringToInsert, position){
    if(position < 0|| position > originalString.length){
        return "Invalid position"
    }
    return originalString.slice(0, position) + stringToInsert + originalString.slice(position);
}
console.log(insert('We are doing some exercises.', 'JavaScript ', 18));
//Question fifteen: -Humanize format
function humanize_format(number){
    const numStr= number.toString();
    const lastTwoDigits= number%100;
    let suffix;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13){
        suffix = 'th';
    }else{
        switch(number % 10){
            case 1:
                suffix= 'st';
                break;
            case 2:
                suffix='nd';
                break;
            case 3:
                suffix= 'rd';
                break;
            default:
                suffix= 'th';
                break;
        }
    }
    return numStr + suffix;
}
console.log(humanize_format(301));
//Question sixteen: -Truncate string with ellipsis
function text_truncate(str, length, appendString= '...'){
    if(str.length<=length){
        return str;
    }
    return str.slice(0,length)+appendString;
}
console.log(text_truncate("We are doing JS string exercises",15,'!!'));

//Question seventeen- Chop String into Chunks
function string_chop(str, chunkSize){
    const chunks=[];
    for(let i=0; i< str.length; i+=chunkSize){
        chunks.push(str.slice(i, i + chunkSize));
    }
    return chunks;
}
console.log(string_chop('w3resource',3));

//Question eighteen- Count substring occurences
function count(str, substring){
    const lowerStr= str.toLowerCase();
    const lowerSubstring= substring.toLowerCase();
    let count= 0;
    let pos= 0;
    while((pos=lowerStr.indexOf(lowerSubstring, pos))!==-1){
        count++;
        pos+=lowerSubstring.length;
    }
    return count;
}
console.log(count("The quick brown fox jumps over the lazy dog",'the'));

//Question nineteen- Reverse Binary Representation
function reverse_binary(num){
    const binaryStr= num.toString(2);
    const reversedBinaryStr= binaryStr.split('').reverse().join('');
    return parseInt(reversedBinaryStr, 2);
}
console.log(reverse_binary(100));
//Question twenty- Pad string to length
function formatted_string(padStr, num, direction){
    const numStr= num.toString();
    const totalLength= padStr.length;
    if(direction ==='l'){
        return (padStr + numStr).slice(-totalLength);
    }else if(direction ==='r'){
        return (numStr + padStr).slice(0, totalLength);
    } else{
        throw new error("Invalid direction. Use 'l' for left or 'r' for right.");
    }
}
console.log(formatted_string('0000',123,'l'));
