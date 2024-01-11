#!/usr/bin/env bash

# Ensure the script stops on first error
set -e


####################################################################################################
# NOTE - This script just returns a big blob of all the functions that the authority has created
#        It's not very useful, but it's a good example of how to call a function on a contract
#        and get a response back.
#
# If you want a more useful query, see get_function.rs 
# (rust "script" that can be used with nightly)
####################################################################################################

# Default profile will be main if not set 
PROFILE_NAME='main'
[ -n "${PROFILE}" ] && PROFILE_NAME=${PROFILE}

FAILED_TESTS=false

# Default RPC URL will be goerli if not set
RPC_URL="https://starknet-goerli.infura.io/v3/<infura key>"
[ -n "${RPC}" ] && RPC_URL=${RPC}


# Print Profile name and RPC URL
echo "Profile: $PROFILE_NAME"
echo "RPC URL: $RPC_URL"


USER_ADDRESS=$(jq -r '.deployment.address' ~/.starkli-wallets/main/account.json)
PUBLIC_KEY=$(jq -r '.variant.public_key' ~/.starkli-wallets/main/account.json)
AUTHORITY_ADDRESS="$USER_ADDRESS"


# Check if cargo-script is installed
if ! command -v cargo-script &> /dev/null
then
    echo "cargo-script is not installed. Please install it using 'cargo install cargo-script'."
    exit 1
fi


# Function to convert a string into an array of felts
long_string_to_felts() {
    local input_string="$1"

    # Convert the string to hex
    local hex_string=$(echo -n "$input_string" | xxd -p | tr -d '')

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

# Step 1: Verify that there's a contract to run
if [ -n "$CONTRACT_ADDRESS" ]; then
    echo "Creating Attestation Queue. Contract Address: $CONTRACT_ADDRESS"
else
  echo "No Contract Address provided. Set CONTRACT_ADDRESS to continue."
  exit 0
fi

echo "starkli call --rpc $RPC_URL \
  $CONTRACT_ADDRESS get_functions_by_authority \
  $AUTHORITY_ADDRESS"

starkli call --rpc $RPC_URL \
  $CONTRACT_ADDRESS get_functions_by_authority \
  $AUTHORITY_ADDRESS


