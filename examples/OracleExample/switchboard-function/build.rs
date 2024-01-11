fn main() {
    println!("cargo:rerun-if-env-changed=RECEIVER_ADDRESS");
    // Read the environment variable
    let value =
        std::env::var("RECEIVER_ADDRESS").expect("RECEIVER_ADDRESS must be set");
    let rpc_value =
        std::env::var("RPC").expect("RPC must be set");

    // Pass it to the Rust compiler
    println!("cargo:rustc-env=RECEIVER_ADDRESS={}", value);
    println!("cargo:rustc-env=RPC={}", rpc_value);
}
