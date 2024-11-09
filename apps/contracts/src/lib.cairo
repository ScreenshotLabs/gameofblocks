use starknet::ContractAddress;

#[starknet::contract]
mod game {
    use starknet::event::EventEmitter;
    use core::starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, StorageMapReadAccess,
        StorageMapWriteAccess, Map
    };
    use starknet::{ContractAddress, get_caller_address};
    use core::traits::Into;

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        PlayerCreated: PlayerCreated,
        BossAttacked: BossAttacked,
        BossDefeated: BossDefeated,
        PlayerUpgraded: PlayerUpgraded,
        GoldEarned: GoldEarned,
        BossCreated: BossCreated,
    }

    #[derive(Drop, starknet::Event)]
    struct BossAttacked {
        #[key]
        player: ContractAddress,
        boss_id: u32,
        damage_dealt: u32,
        health_remaining: u32,
    }

    #[derive(Drop, starknet::Event)]
    struct BossDefeated {
        #[key]
        player: ContractAddress,
        boss_id: u32,
    }

    #[derive(Drop, starknet::Event)]
    struct PlayerCreated {
        #[key]
        player: ContractAddress,
        attack_power: u32,
        energy_cap: u32,
        energy_recovery: u32,
        attack_level: u32,
        energy_level: u32,
        recovery_level: u32,
        current_boss: u32,
        gold: u128,
    }

    #[derive(Drop, starknet::Event)]
    struct PlayerUpgraded {
        #[key]
        player: ContractAddress,
        upgrade_type: u8,
        attack_power: u32,
        energy_cap: u32,
        energy_recovery: u32,
        attack_level: u32,
        energy_level: u32,
        recovery_level: u32,
        current_boss: u32,
        gold: u128,
        upgrade_cost: u128,
    }

    #[derive(Drop, starknet::Event)]
    struct GoldEarned {
        #[key]
        player: ContractAddress,
        amount: u128,
        total_gold: u128,
    }

    #[derive(Drop, starknet::Event)]
    struct BossCreated {
        #[key]
        boss_id: u32,
        health: u32,
    }

    #[storage]
    struct Storage {
        // Player data
        player_attack_power: Map::<ContractAddress, u32>,
        player_energy_cap: Map::<ContractAddress, u32>,
        player_energy_recovery: Map::<ContractAddress, u32>,
        player_current_boss: Map::<ContractAddress, u32>,
        player_exists: Map::<ContractAddress, bool>,
        // Economy data
        player_gold: Map::<ContractAddress, u128>,
        player_attack_level: Map::<ContractAddress, u32>,
        player_energy_level: Map::<ContractAddress, u32>,
        player_recovery_level: Map::<ContractAddress, u32>,
        player_last_energy_update: Map::<ContractAddress, u64>,
        // Boss data
        boss_base_health: Map::<u32, u32>,
        boss_is_active: Map::<u32, bool>,
        next_boss_id: u32,
        boss_current_health: Map::<(ContractAddress, u32), u32>,
        boss_is_defeated: Map::<(ContractAddress, u32), bool>,
        // Admin
        is_admin: Map::<ContractAddress, bool>,
    }

    #[constructor]
    fn constructor(ref self: ContractState, admin: ContractAddress) {
        self.is_admin.write(admin, true);
        self.next_boss_id.write(1);
    }

    #[abi(embed_v0)]
    impl GameActions of super::IGameActions<ContractState> {
        fn spawn(ref self: ContractState) {
            let player = get_caller_address();
            assert(!self.player_exists.read(player), 'Player already exists');

            // Initialize player base stats
            self.player_exists.write(player, true);
            self.player_attack_power.write(player, 1);
            self.player_energy_cap.write(player, 3000);
            self.player_energy_recovery.write(player, 10);
            self.player_current_boss.write(player, 1);

            // Initialize economy stats
            self.player_gold.write(player, 0);
            self.player_attack_level.write(player, 1);
            self.player_energy_level.write(player, 1);
            self.player_recovery_level.write(player, 1);
            self.player_last_energy_update.write(player, starknet::get_block_timestamp());

            // Set up first boss fight if exists
            assert(self.boss_is_active.read(1), 'No active boss found');
            let boss_health = self.boss_base_health.read(1);
            self.boss_current_health.write((player, 1), boss_health);
            self.boss_is_defeated.write((player, 1), false);

            self
                .emit(
                    Event::PlayerCreated(
                        PlayerCreated {
                            player,
                            attack_power: 1,
                            energy_cap: 3000,
                            energy_recovery: 10,
                            attack_level: 1,
                            energy_level: 1,
                            recovery_level: 1,
                            current_boss: 1,
                            gold: 0,
                        }
                    )
                );
        }

        fn attack_boss(ref self: ContractState) {
            let player = get_caller_address();
            assert(self.player_exists.read(player), 'Player does not exist');

            let current_boss = self.player_current_boss.read(player);
            assert(self.boss_is_active.read(current_boss), 'Boss not active');
            assert(!self.boss_is_defeated.read((player, current_boss)), 'Boss already defeated');

            // Get player attack and boss health
            let attack_power = self.player_attack_power.read(player);
            let mut boss_health = self.boss_current_health.read((player, current_boss));

            // Apply damage and earn gold
            if boss_health > attack_power {
                boss_health -= attack_power;
                self.boss_current_health.write((player, current_boss), boss_health);

                // Earn gold (2x damage dealt)
                let gold_earned: u128 = (attack_power * 2).into();
                let current_gold = self.player_gold.read(player);
                self.player_gold.write(player, current_gold + gold_earned);

                // Emit events
                self
                    .emit(
                        Event::BossAttacked(
                            BossAttacked {
                                player,
                                boss_id: current_boss,
                                damage_dealt: attack_power,
                                health_remaining: boss_health
                            }
                        )
                    );
                self
                    .emit(
                        Event::GoldEarned(
                            GoldEarned {
                                player, amount: gold_earned, total_gold: current_gold + gold_earned
                            }
                        )
                    );
            } else {
                // Boss defeated
                self.boss_is_defeated.write((player, current_boss), true);
                self.boss_current_health.write((player, current_boss), 0);

                // Earn remaining gold
                let gold_earned: u128 = (boss_health * 2).into();
                let current_gold = self.player_gold.read(player);
                self.player_gold.write(player, current_gold + gold_earned);

                // Check if next boss exists
                let next_boss = current_boss + 1;
                if self.boss_is_active.read(next_boss) {
                    // Set up next boss
                    let next_boss_health = self.boss_base_health.read(next_boss);
                    self.boss_current_health.write((player, next_boss), next_boss_health);
                    self.boss_is_defeated.write((player, next_boss), false);
                    self.player_current_boss.write(player, next_boss);
                }

                // Emit events
                self.emit(Event::BossDefeated(BossDefeated { player, boss_id: current_boss }));
                self
                    .emit(
                        Event::GoldEarned(
                            GoldEarned {
                                player, amount: gold_earned, total_gold: current_gold + gold_earned
                            }
                        )
                    );
            }
        }

        fn upgrade_attack(ref self: ContractState) {
            let player = get_caller_address();
            assert(self.player_exists.read(player), 'Player does not exist');

            let current_level = self.player_attack_level.read(player);
            let cost = _calculate_upgrade_cost(100, current_level);

            let current_gold = self.player_gold.read(player);
            assert(current_gold >= cost, 'Insufficient gold');

            // Apply upgrade
            self.player_gold.write(player, current_gold - cost);
            self.player_attack_level.write(player, current_level + 1);

            let new_attack = self.player_attack_power.read(player) + 1;
            self.player_attack_power.write(player, new_attack);

            self
                .emit(
                    Event::PlayerUpgraded(
                        PlayerUpgraded {
                            player,
                            upgrade_type: 1,
                            attack_power: new_attack,
                            energy_cap: self.player_energy_cap.read(player),
                            energy_recovery: self.player_energy_recovery.read(player),
                            attack_level: current_level + 1,
                            energy_level: self.player_energy_level.read(player),
                            recovery_level: self.player_recovery_level.read(player),
                            current_boss: self.player_current_boss.read(player),
                            gold: current_gold - cost,
                            upgrade_cost: cost,
                        }
                    )
                );
        }

        fn upgrade_energy_cap(ref self: ContractState) {
            let player = get_caller_address();
            assert(self.player_exists.read(player), 'Player does not exist');

            let current_level = self.player_energy_level.read(player);
            let cost = _calculate_upgrade_cost(150, current_level);

            let current_gold = self.player_gold.read(player);
            assert(current_gold >= cost, 'Insufficient gold');

            // Apply upgrade
            self.player_gold.write(player, current_gold - cost);
            self.player_energy_level.write(player, current_level + 1);
            let new_energy_cap = self.player_energy_cap.read(player) + 1000;
            self.player_energy_cap.write(player, new_energy_cap);

            self
                .emit(
                    Event::PlayerUpgraded(
                        PlayerUpgraded {
                            player,
                            upgrade_type: 2,
                            attack_power: self.player_attack_power.read(player),
                            energy_cap: new_energy_cap,
                            energy_recovery: self.player_energy_recovery.read(player),
                            attack_level: self.player_attack_level.read(player),
                            energy_level: current_level + 1,
                            recovery_level: self.player_recovery_level.read(player),
                            current_boss: self.player_current_boss.read(player),
                            gold: current_gold - cost,
                            upgrade_cost: cost,
                        }
                    )
                );
        }

        fn upgrade_energy_recovery(ref self: ContractState) {
            let player = get_caller_address();
            assert(self.player_exists.read(player), 'Player does not exist');

            let current_level = self.player_recovery_level.read(player);
            let cost = _calculate_upgrade_cost(200, current_level);

            let current_gold = self.player_gold.read(player);
            assert(current_gold >= cost, 'Insufficient gold');

            // Apply upgrade
            self.player_gold.write(player, current_gold - cost);
            self.player_recovery_level.write(player, current_level + 1);
            let new_recovery = self.player_energy_recovery.read(player) + 10;
            self.player_energy_recovery.write(player, new_recovery);

            self
                .emit(
                    Event::PlayerUpgraded(
                        PlayerUpgraded {
                            player,
                            upgrade_type: 3,
                            attack_power: self.player_attack_power.read(player),
                            energy_cap: self.player_energy_cap.read(player),
                            energy_recovery: new_recovery,
                            attack_level: self.player_attack_level.read(player),
                            energy_level: self.player_energy_level.read(player),
                            recovery_level: current_level + 1,
                            current_boss: self.player_current_boss.read(player),
                            gold: current_gold - cost,
                            upgrade_cost: cost,
                        }
                    )
                );
        }

        fn add_boss(ref self: ContractState, base_health: u32) {
            let caller = get_caller_address();
            assert(self.is_admin.read(caller), 'Caller is not admin');

            let boss_id = self.next_boss_id.read();
            self.boss_base_health.write(boss_id, base_health);
            self.boss_is_active.write(boss_id, true);
            self.next_boss_id.write(boss_id + 1);
            self.emit(Event::BossCreated(BossCreated { boss_id: boss_id, health: base_health }));
        }

        fn set_admin(ref self: ContractState, address: ContractAddress, is_admin: bool) {
            let caller = get_caller_address();
            assert(self.is_admin.read(caller), 'Caller is not admin');
            self.is_admin.write(address, is_admin);
        }

        // View functions
        fn get_player_stats(self: @ContractState, player: ContractAddress) -> (u32, u32, u32) {
            assert(self.player_exists.read(player), 'Player does not exist');
            let attack = self.player_attack_power.read(player);
            let energy_cap = self.player_energy_cap.read(player);
            let recovery = self.player_energy_recovery.read(player);
            (attack, energy_cap, recovery)
        }

        fn get_player_levels(self: @ContractState, player: ContractAddress) -> (u32, u32, u32) {
            assert(self.player_exists.read(player), 'Player does not exist');
            (
                self.player_attack_level.read(player),
                self.player_energy_level.read(player),
                self.player_recovery_level.read(player)
            )
        }

        fn get_upgrade_costs(self: @ContractState, player: ContractAddress) -> (u128, u128, u128) {
            assert(self.player_exists.read(player), 'Player does not exist');
            (
                _calculate_upgrade_cost(100, self.player_attack_level.read(player)),
                _calculate_upgrade_cost(150, self.player_energy_level.read(player)),
                _calculate_upgrade_cost(200, self.player_recovery_level.read(player))
            )
        }

        fn get_player_gold(self: @ContractState, player: ContractAddress) -> u128 {
            assert(self.player_exists.read(player), 'Player does not exist');
            self.player_gold.read(player)
        }

        fn get_player_current_boss(self: @ContractState, player: ContractAddress) -> u32 {
            assert(self.player_exists.read(player), 'Player does not exist');
            self.player_current_boss.read(player)
        }

        fn get_player_exists(self: @ContractState, player: ContractAddress) -> bool {
            self.player_exists.read(player)
        }

        fn get_boss_info(self: @ContractState, boss_id: u32) -> (u32, bool) {
            let base_health = self.boss_base_health.read(boss_id);
            let is_active = self.boss_is_active.read(boss_id);
            (base_health, is_active)
        }

        fn get_next_boss_id(self: @ContractState) -> u32 {
            self.next_boss_id.read()
        }

        fn get_player_boss_state(
            self: @ContractState, player: ContractAddress, boss_id: u32
        ) -> (u32, bool) {
            assert(self.player_exists.read(player), 'Player does not exist');
            assert(self.boss_is_active.read(boss_id), 'Boss not active');

            let current_health = self.boss_current_health.read((player, boss_id));
            let is_defeated = self.boss_is_defeated.read((player, boss_id));

            (current_health, is_defeated)
        }

        fn is_admin(self: @ContractState, address: ContractAddress) -> bool {
            self.is_admin.read(address)
        }
    }

    fn _calculate_upgrade_cost(base_price: u128, current_level: u32) -> u128 {
        let multiplier: u128 = 26000; // 2.6 in basis points
        let mut cost = base_price;
        let mut level = 1;

        while level < current_level {
            cost = (cost * multiplier) / 10000;
            level += 1;
        };
        cost
    }
}

#[starknet::interface]
trait IGameActions<T> {
    // Actions
    fn spawn(ref self: T);
    fn attack_boss(ref self: T);
    fn upgrade_attack(ref self: T);
    fn upgrade_energy_cap(ref self: T);
    fn upgrade_energy_recovery(ref self: T);
    fn add_boss(ref self: T, base_health: u32);
    fn set_admin(ref self: T, address: ContractAddress, is_admin: bool);

    // Views
    fn get_player_stats(self: @T, player: ContractAddress) -> (u32, u32, u32);
    fn get_player_levels(self: @T, player: ContractAddress) -> (u32, u32, u32);
    fn get_upgrade_costs(self: @T, player: ContractAddress) -> (u128, u128, u128);
    fn get_player_gold(self: @T, player: ContractAddress) -> u128;
    fn get_player_current_boss(self: @T, player: ContractAddress) -> u32;
    fn get_player_exists(self: @T, player: ContractAddress) -> bool;
    fn get_boss_info(self: @T, boss_id: u32) -> (u32, bool);
    fn get_next_boss_id(self: @T) -> u32;
    fn get_player_boss_state(self: @T, player: ContractAddress, boss_id: u32) -> (u32, bool);
    fn is_admin(self: @T, address: ContractAddress) -> bool;
}
