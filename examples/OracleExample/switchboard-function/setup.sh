 cat ../target/dev/switchboard_price_oracle_PriceOracle.contract_class.json | jq .abi > ./src/price_oracle.json
 echo "Copied ABI to switchboard-function/src/price_oracle.json!"