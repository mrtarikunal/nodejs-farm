module.exports = (temp, product) => {
  //template dosyası ve array olarak porduct datası gelyr
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  //template ler içinde yazdğmz dinamik değişken isimlerini gerçek data ile değştryz
  //let kullandık çünkü her sefrnde değeri değştryz
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  
  if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  return output;
}