const ethers = require('ethers');
require('dotenv').config();
import moment from 'moment';

const url = process.env.ALCHEMY_URL;

const provider = new ethers.providers.JsonRpcProvider(url);
const testAddress = "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8"

async function allBlocks() {



  let lastNumber = await provider.getBlockNumber()
  var blocks = []
  for (let i = 0; i < 20; i++) {
    const block = await provider.getBlock(lastNumber - i)
    blocks.push(block)
  }


  function buildBlockTable() {
    let blockData = `
                <table id='myTable'>
                  <thead>
                    <tr>
                      <th class='block-head'>Block #</th>
                      <th class='time-head'>Time</th>
                      <th class='txn-head'>Txn</th>
                      <th class='hash-head'>Hash</th>
                      <th class='limit-head'>Gas Limit</th>
                      <th class='used-head'>Gas Used</th>
                    </tr>
                  </thead>
                  <tbody>
            `;

    for (let i = 0; i < blocks.length; i++) {
      let block = blocks[i]

      function timeFormat(timestamp) {
        return moment.duration(Date.now()-(timestamp*1000)).humanize() + " ago";
      }

      let decGasLimit = parseInt(block.gasLimit, 16)

      let rowHTML = `
                    <tr class="coins-table">
                      <td class="block-number">${block.number}</td>
                      <td class='time-data'>${timeFormat(block.timestamp)}</td>
                      <td class='txn-data'>${block.transactions.length}</td>
                      <td class="hash-data">${block.hash}</td>
                      <td class="limit-data">${block.gasLimit}</td>
                      <td class="used-data">${block.gasUsed}</td>
                    </tr>`;
      blockData += rowHTML;
    }

    blockData += `
                  </tbody>
                </table>`;



    return blockData;
  }

  let blockTable = buildBlockTable()
  document.getElementById('block-table').innerHTML = blockTable;

}

async function searchFunction() {
  var address, balance, etherBalance, txnCount;
  //address = testAddress;
  address = document.getElementById("search-bar").value;
  address = address.toLowerCase();
  balance = await provider.getBalance(address)
  etherBalance = ethers.utils.formatEther(balance)
  txnCount = await provider.getTransactionCount(address)

  function buildAddressTable() {
    let addressData = `
              <h4 class='addressHead'>${address}</h4>
              <table id='addressTable'>
                  <tr>
                    <th class='balance-head'>Balance: </th>
                    <td class="block-number">${etherBalance + " ETH"}</td>
                  </tr>
                  <tr>
                    <th class='address-txn-head'>Txn Count: </th>
                    <td class='time-data'>${txnCount}</td>
                  </tr>
                <tbody>
                </table>
          `;

    return addressData;
  }

  let addressTable = buildAddressTable()
  document.getElementById('address-table').innerHTML = addressTable;

  document.getElementById("myBtn").value = "";


}
let button = document.getElementById("myBtn")
button.addEventListener("click", () => {
  searchFunction()
});

window.addEventListener('load', () => {
  allBlocks()

});
