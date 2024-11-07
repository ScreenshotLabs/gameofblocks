# StarkNet Deployment Guide

This README provides instructions for deploying accounts and contracts on StarkNet using Deno tasks.

## Prerequisites

- Deno installed on your system
- Required environment variables set up

## Environment Setup

Create a `.env` file in your project root with the following variables:

```env
# Network Selection (Required)
STARKNET_NETWORK=SN_SEPOLIA  # or SN_MAINNET

# Account Configuration (Required after account creation)
STARKNET_ACCOUNT_ADDRESS_ADMIN=<address_of_first_account>
STARKNET_ACCOUNT_PRIVATE_KEY_ADMIN=<private_key_of_first_account>

# Optional Configuration
# Add any additional environment variables your deployment needs
```

### Network Selection

Before running any deployment tasks, ensure you've set the correct network:

- **Sepolia Testnet**: `STARKNET_NETWORK=SN_SEPOLIA`
- **MainNet**: `STARKNET_NETWORK=SN_MAINNET`

## Deployment Steps

### 1. Generate New Accounts

Create multiple new accounts at once:

```bash
deno task accounts:new -a 3  # Creates 3 new accounts
```

This will:
- Generate account keypairs
- Store account details for later deployment
- Output account addresses and private keys

### 2. Deploy Accounts and Fund with ETH

Deploy the generated accounts and send initial ETH:

```bash
deno task accounts:deploy
```

This task will:
- Check for sufficient funds
- Deploy each account contract
- Initialize account permissions
- Output deployment status for each account

### 3. Configure Admin Account

After account deployment, set up the admin account environment variables:

```env
STARKNET_ACCOUNT_ADDRESS_ADMIN=<address_of_first_account>
STARKNET_ACCOUNT_PRIVATE_KEY_ADMIN=<private_key_of_first_account>
```

These credentials will be used for subsequent contract deployments.

### 4. Deploy Contracts

Deploy your contracts using the admin account:

```bash
deno task contract:deploy
```

This will:
- Validate admin account setup
- Deploy contract(s)
- Output deployed contract addresses
- Verify contract deployment

## Available Tasks

```bash
deno task accounts:new      # Generate new accounts
deno task accounts:deploy   # Deploy generated accounts
deno task contract:deploy   # Deploy contracts using admin account
```

## Troubleshooting

Common issues and solutions:

- **Network Mismatch**: Ensure `STARKNET_NETWORK` matches your intended deployment network
- **Insufficient Funds**: Make sure your accounts have enough ETH for deployment
- **Failed Deployment**: Check network status and try again
- **Invalid Admin**: Verify admin account environment variables are set correctly

## Development Notes

- Always test deployments on Sepolia first
- Keep private keys secure and never commit them to version control
- Backup account details after generation
- Monitor gas costs on MainNet deployments

## Environment Variables Reference

```env
# Required
STARKNET_NETWORK=           # SN_SEPOLIA or SN_MAINNET

# Required after account creation
STARKNET_ACCOUNT_ADDRESS_ADMIN=    # Admin account address
STARKNET_ACCOUNT_PRIVATE_KEY_ADMIN=  # Admin account private key

# Optional
# Add any additional configuration needed
```

## Security Considerations

- Never share private keys
- Use different accounts for testing and production
- Follow StarkNet security best practices
- Regularly rotate admin keys on production

## Contributing

[Your contribution guidelines here]

## License

[Your license here]

## Additional Resources

- [StarkNet Documentation](https://docs.starknet.io/)
- [StarkNet Security Guidelines](https://docs.starknet.io/documentation/security/)
- [Deno Documentation](https://deno.land/manual)