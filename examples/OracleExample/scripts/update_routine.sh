#!/usr/bin/env bash

# Ensure the script stops on first error
set -e

# Default profile will be $PROFILE_NAME if not set 
PROFILE_NAME='$PROFILE_NAME'
[ -n "${PROFILE}" ] && PROFILE_NAME=${PROFILE}

FAILED_TESTS=false

# Default RPC URL will be goerli if not set
RPC_URL="https://starknet-goerli.infura.io/v3/<infura key>"
[ -n "${RPC}" ] && RPC_URL=${RPC}

# Print Profile name and RPC URL
echo "Profile: $PROFILE_NAME"
echo "RPC URL: $RPC_URL"


# Function Create Params
QUEUE_ID=0x0000000000000000000000000000000000000000000000000000000000000001
USER_ADDRESS=$(jq -r '.deployment.address' ~/.starkli-wallets/$PROFILE_NAME/account.json)
PUBLIC_KEY=$(jq -r '.variant.public_key' ~/.starkli-wallets/$PROFILE_NAME/account.json)
AUTHORITY_ADDRESS="$USER_ADDRESS"
SCHEDULE='0 0 */3 * * *'
PARAMS="0x000000000000000000000000000000000000000000000000000000000000000"
FUNDING="177386910000000"

# Placeholder variables for AttestationQueueCreateParams
USER_ADDRESS=$(jq -r '.deployment.address' ~/.starkli-wallets/$PROFILE_NAME/account.json)
AUTHORITY_ADDRESS="$USER_ADDRESS"


# Function to convert a string into an array of felts
long_string_to_felts() {
    local input_string="$1"

    # Convert the string to hex
    local hex_string=$(echo -n "$input_string" | xxd -p | tr -d '\n')

    # Split the hex string into chunks of 31 bytes (62 hex characters) and format them
    local chunk_size=62
    local formatted_hex_array=()
    while [ -n "$hex_string" ]; do
        # Extract chunk and pad with leading zeros to 64 characters
        local chunk=$(printf "%064s" "${hex_string:0:$chunk_size}" | tr ' ' '0')
        # Prefix with 0x and add to array
        formatted_hex_array+=("0x$chunk")
        # Move to the next chunk
        hex_string=${hex_string:$chunk_size}
    done

    # Get the length of the array
    local len=${#formatted_hex_array[@]}
    local len_hex=$(printf "0x%062x" "$len")

    # Prepend LEN to the array
    formatted_hex_array=("$len_hex" "${formatted_hex_array[@]}")

    # Return the formatted hex array
    echo "${formatted_hex_array[@]}"
}

# Function that converts a comma separated list of hex strings into an array of u256-encoded felts
comma_separated_hex_to_felts() {
    local input_string="$1"

    # Split the string into an array
    IFS=',' read -r -a felts <<< "$input_string"

    # Convert each element to u256
    local u256_felts=()
    for felt in "${felts[@]}"; do
        u256_felts+=("u256:$felt")
    done

    # Get the length of the array
    local len=${#u256_felts[@]}
    local len_hex=$(printf "0x%062x" "$len")

    # Prepend LEN to the array
    u256_felts=("$len_hex" "${u256_felts[@]}")

    # Return the u256 felts
    echo "${u256_felts[@]}"
}


if [ -n "$CONTRACT_ADDRESS" ]; then
    echo "Contract Address: $CONTRACT_ADDRESS"
else
  echo "No Contract Address provided. Set CONTRACT_ADDRESS to continue."
  exit 0
fi

if [ -n "$FUNCTION_ADDRESS" ]; then 
    echo "Function Address: $FUNCTION_ADDRESS"
else
  echo "No Function Address provided. Set FUNCTION_ADDRESS to continue."
  exit 0
fi

if [ -n "$ROUTINE_ID" ]; then 
    echo "Routine ID: $ROUTINE_ID"
else
  echo "No Routine ID provided. Set ROUTINE_ID to continue."
  exit 0
fi

if [ -n "$ESCROW_ADDRESS" ]; then 
    echo "Escrow Address: $ESCROW_ADDRESS"
else
  echo "No Authority Address provided. Set AUTHORITY_ADDRESS to continue."
  exit 0
fi

echo "starkli invoke --account ~/.starkli-wallets/$PROFILE_NAME/account.json --rpc $RPC_URL \
  $CONTRACT_ADDRESS routine_update \
  $ROUTINE_ID \
  $AUTHORITY_ADDRESS \
  $FUNCTION_ADDRESS \
  $PARAMS \
  str:'0 */30 * * * *' \
  $ESCROW_ADDRESS
"

starkli invoke --account ~/.starkli-wallets/$PROFILE_NAME/account.json --rpc $RPC_URL \
  $CONTRACT_ADDRESS routine_update \
  $ROUTINE_ID \
  $AUTHORITY_ADDRESS \
  $FUNCTION_ADDRESS \
  $PARAMS \
  str:"0 */30 * * * *" \
  $ESCROW_ADDRESS
