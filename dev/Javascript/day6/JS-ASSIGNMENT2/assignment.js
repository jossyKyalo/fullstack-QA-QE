//1.Check if a string is a palindrome
function isPalindrome(str) {
    let newStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    let reversedStr = newStr.split('').reverse().join('');
    return newStr === reversedStr;
}
console.log(isPalindrome('A man, a plan, a canal, Panama'));
console.log(isPalindrome('Was it a car or a cat I saw?'));
console.log(isPalindrome('Hello World!'));

//2.reverse string
function reverseString(str) {
    return str.split('').reverse().join('')
}
console.log(reverseString("I love myself"))

//3.finding the longest palindromic substring
function longestPalindromicSubstring(s) {
    let longest = "";
    for (let i = 0; i < s.length; i++) {
        for (let j = i; j < s.length; j++) {
            let substring = s.substring(i, j + 1);
            if (isPalindrome(substring) && substring.length > longest.length) {
                longest = substring;
            }
        }
    }
    return longest;
}
console.log(longestPalindromicSubstring('babad'));
console.log(longestPalindromicSubstring('cbbd'));

//4. Check if two strings are anagrams
function areAnagrams(str1, str2) {
      let cleanedStr1 = str1.toLowerCase().replace(/\s+/g, '');
      let cleanedStr2 = str2.toLowerCase().replace(/\s+/g, '');
  
      if (cleanedStr1.length !== cleanedStr2.length) {
          return false;
      }
  
      let sortedStr1 = cleanedStr1.split('').sort().join('');
      let sortedStr2 = cleanedStr2.split('').sort().join('');
  
      return sortedStr1 === sortedStr2;
}
console.log(areAnagrams('Listen', 'Silent'));
console.log(areAnagrams('Hello', 'World'));

//5. Remove Duplicates from a string
function removeDuplicates(str) {
    return [...new Set(str)].join('');

}
console.log(removeDuplicates('programming'))
console.log(removeDuplicates('hello world'))
console.log(removeDuplicates('aaaaa'))
console.log(removeDuplicates('abcd'))
console.log(removeDuplicates('aabbcc'))

//6. Count Palindromes in a string
function countPalindrome(s) {
    let count = new Set();
    for (let i = 0; i < s.length; i++) {
        for (let j = i; j < s.length; j++) {
            let substring = s.substring(i, j + 1);
            if (isPalindrome(substring)) {
                count.add(substring);
            }
        }
    }
    return count.size;
}
console.log(countPalindrome('ababa'));
console.log(countPalindrome('racecar'));
console.log(countPalindrome('aabb'));
console.log(countPalindrome('a'));
console.log(countPalindrome('abc'));
 
//7. Longest Common Prefix
function longestCommonPrefix(strs){
    if(strs.length===0){
        return "";
    }
    let prefix= strs[0];
    for (let i=1; i< strs.length; i++){
        while (strs[i].indexOf(prefix)!==0){
            prefix= prefix.substring(0, prefix.length-1);
            if (prefix===''){
                return '';
            }
        }
    }
    return prefix;

}
console.log(longestCommonPrefix(['flower','flow','flight']));
console.log(longestCommonPrefix(['dog','racecar','car']));
console.log(longestCommonPrefix(['interspecies','intersteller','interstate']));
console.log(longestCommonPrefix(['prefix','prefixes','preform']));
console.log(longestCommonPrefix(['apple','banana','cherry']));

//8. Case Insensitive Prefix
function isCaseInsensitivePalindrome(str){
    let lowerStr = str.toLowerCase();
    return lowerStr === lowerStr.split('').reverse().join('');
}

console.log(isCaseInsensitivePalindrome('Aba'));
console.log(isCaseInsensitivePalindrome('Racecar'));
console.log(isCaseInsensitivePalindrome('Palindrome'));
console.log(isCaseInsensitivePalindrome('Madam'));
console.log(isCaseInsensitivePalindrome('Hello'));