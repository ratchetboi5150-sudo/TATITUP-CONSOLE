fx_version 'cerulean'
game 'gta5'

author 'tdtmedia&tatituptech'
description 'Functional Handheld Retro Console Prop & Emulator'
version '1.0.0'

ui_page 'nui/index.html'

files {
    'stream/chi_switch_v1.ytyp',
    'nui/index.html',
    'nui/emulator.html',
    'nui/style.css',
    'nui/script.js',
    'nui/*.png',
    'nui/*.jpg',
    'nui/emulatorjs/**',
    
    -- Bios
    'bios/gba_bios.bin',
    
    -- Game ROMs
    'roms/nes_1200_in_1.nes',
    'roms/snes_donkey_kong_country.smc',
    'roms/gb_zelda_links_awakening.gb',
    'roms/gbc_pokemon_gold.gbc',
    'roms/genesis_sonic_hedgehog.md',
    'roms/genesis_streets_of_rage_3.md',
    'roms/snes_super_mario_all_stars.sfc',
    'roms/nes_super_mario_bros_3.nes',
    'roms/snes_super_mario_kart.sfc',
    'roms/snes_ultimate_mortal_kombat_3.sfc'
}

client_scripts {
    'client/main.lua'
}

server_scripts {
    'server/main.lua'
}

data_file 'DLC_ITYP_REQUEST' 'stream/chi_switch_v1.ytyp'

