local isConsoleOpen = false
local isMouseFocused = true
local consoleProp = nil
local animDict = "amb@world_human_tourist_map@male@base"
local animName = "base"
local propModel = "chi_switch_v1"

-- Default bone: 18905 (Left Hand PH_L_Hand)
-- These default offsets position the Nintendo Switch console nicely in the player's hands
local offset = {
    x = 0.14,
    y = -0.01,
    z = -0.03,
    rx = -65.0,
    ry = 180.0,
    rz = 75.0
}

-- Load Animation Dictionary Helper
local function loadAnimDict(dict)
    if not DoesAnimDictExist(dict) then
        print(string.format("^1[Console Error]^7 Animation dictionary '%s' does not exist!", dict))
        return false
    end
    RequestAnimDict(dict)
    local timeout = 200 -- 2 seconds timeout (200 * 10ms)
    while not HasAnimDictLoaded(dict) and timeout > 0 do
        Citizen.Wait(10)
        timeout = timeout - 1
    end
    if timeout <= 0 then
        print(string.format("^1[Console Error]^7 Animation dictionary '%s' failed to load within 2 seconds!", dict))
        return false
    end
    return true
end

-- Load Model Helper
local function loadModel(model)
    local hash = GetHashKey(model)
    if HasModelLoaded(hash) then
        return true
    end
    RequestModel(hash)
    local timeout = 200 -- 2 seconds timeout (200 * 10ms)
    while not HasModelLoaded(hash) and timeout > 0 do
        Citizen.Wait(10)
        timeout = timeout - 1
    end
    if timeout <= 0 then
        print(string.format("^1[Console Error]^7 Model '%s' failed to load within 2 seconds!", model))
        return false
    end
    return true
end

-- Attach Console Prop to Ped
local function attachConsole()
    local playerPed = PlayerPedId()
    local boneIdx = GetPedBoneIndex(playerPed, 18905) -- Left Hand
    
    if not loadModel(propModel) then
        print("^1[Console Warning]^7 Skipping prop spawning/attachment as model failed to load.")
        return false
    end
    
    local coords = GetEntityCoords(playerPed)
    consoleProp = CreateObject(GetHashKey(propModel), coords.x, coords.y, coords.z, false, true, false)
    
    AttachEntityToEntity(
        consoleProp, 
        playerPed, 
        boneIdx, 
        offset.x, offset.y, offset.z, 
        offset.rx, offset.ry, offset.rz, 
        false, -- p9
        true, -- useSoftPinning
        false, -- collision
        false, -- isPed
        2, -- vertexIndex
        true -- fixedRot
    )
    
    SetModelAsNoLongerNeeded(GetHashKey(propModel))
    return true
end

-- Detach and Delete Console Prop
local function detachConsole()
    if consoleProp and DoesEntityExist(consoleProp) then
        DeleteEntity(consoleProp)
        consoleProp = nil
    end
end

-- Open the Gaming Console UI and start Animation
local function OpenConsole()
    if isConsoleOpen then return end
    
    local playerPed = PlayerPedId()
    if IsPedInAnyVehicle(playerPed, true) or IsEntityDead(playerPed) then
        return
    end

    isConsoleOpen = true
    isMouseFocused = true
    
    -- Load offsets from KVPs
    local savedOffsetX = GetResourceKvpString("zwitch_offset_x")
    local savedOffsetY = GetResourceKvpString("zwitch_offset_y")
    local savedOffsetZ = GetResourceKvpString("zwitch_offset_z")
    local savedOffsetRX = GetResourceKvpString("zwitch_offset_rx")
    local savedOffsetRY = GetResourceKvpString("zwitch_offset_ry")
    local savedOffsetRZ = GetResourceKvpString("zwitch_offset_rz")

    offset.x = savedOffsetX and tonumber(savedOffsetX) or 0.14
    offset.y = savedOffsetY and tonumber(savedOffsetY) or -0.01
    offset.z = savedOffsetZ and tonumber(savedOffsetZ) or -0.03
    offset.rx = savedOffsetRX and tonumber(savedOffsetRX) or -65.0
    offset.ry = savedOffsetRY and tonumber(savedOffsetRY) or 180.0
    offset.rz = savedOffsetRZ and tonumber(savedOffsetRZ) or 75.0

    -- Load and play the tablet animation (fallback gracefully if fails)
    if loadAnimDict(animDict) then
        TaskPlayAnim(playerPed, animDict, animName, 8.0, -8.0, -1, 49, 0, false, false, false)
    end
    
    -- Spawn and attach the Switch prop (failsafe logic inside)
    attachConsole()
    
    local savedTheme = GetResourceKvpString("zwitch_theme") or "custom-casing"
    local savedVolume = GetResourceKvpString("zwitch_volume")
    local volumeVal = savedVolume and tonumber(savedVolume) or 50
    local savedCrt = GetResourceKvpString("zwitch_crt")
    local crtVal = (savedCrt == nil) and true or (savedCrt == "true")
    local savedEjsSettings = GetResourceKvpString("zwitch_ejs_settings") or "{}"

    -- Trigger NUI Screen
    SendNUIMessage({
        action = "openConsole",
        resourceName = GetCurrentResourceName(),
        theme = savedTheme,
        volume = volumeVal,
        crt = crtVal,
        ejsSettings = savedEjsSettings,
        offsets = {
            x = offset.x,
            y = offset.y,
            z = offset.z,
            rx = offset.rx,
            ry = offset.ry,
            rz = offset.rz
        }
    })
    
    -- Focus keyboard & mouse to NUI
    SetNuiFocus(true, true)
end

-- Close the Gaming Console UI, stop animation, and delete prop
local function CloseConsole()
    if not isConsoleOpen then return end
    
    isConsoleOpen = false
    isMouseFocused = true
    
    -- Detach/delete object
    detachConsole()
    
    -- Stop animation
    local playerPed = PlayerPedId()
    StopAnimTask(playerPed, animDict, animName, 3.0)
    
    -- Hide NUI Screen
    SendNUIMessage({
        action = "closeConsole"
    })
    
    -- Release keyboard & mouse focus
    SetNuiFocus(false, false)
end

-- Keybind Registration: Default key is "I"
RegisterKeyMapping('toggleconsole', 'Toggle Retro Gaming Console', 'keyboard', 'i')

RegisterCommand('toggleconsole', function()
    local playerPed = PlayerPedId()
    if IsEntityDead(playerPed) then return end
    
    if isConsoleOpen then
        CloseConsole()
    else
        OpenConsole()
    end
end, false)

-- NUI Callbacks
RegisterNUICallback('close', function(data, cb)
    CloseConsole()
    cb('ok')
end)

RegisterNUICallback('saveSetting', function(data, cb)
    if data and data.key and data.value ~= nil then
        SetResourceKvp("zwitch_" .. data.key, tostring(data.value))
    end
    cb('ok')
end)

RegisterNUICallback('updateOffset', function(data, cb)
    if data then
        offset.x = tonumber(data.x) or offset.x
        offset.y = tonumber(data.y) or offset.y
        offset.z = tonumber(data.z) or offset.z
        offset.rx = tonumber(data.rx) or offset.rx
        offset.ry = tonumber(data.ry) or offset.ry
        offset.rz = tonumber(data.rz) or offset.rz

        -- Save to KVP
        SetResourceKvp("zwitch_offset_x", tostring(offset.x))
        SetResourceKvp("zwitch_offset_y", tostring(offset.y))
        SetResourceKvp("zwitch_offset_z", tostring(offset.z))
        SetResourceKvp("zwitch_offset_rx", tostring(offset.rx))
        SetResourceKvp("zwitch_offset_ry", tostring(offset.ry))
        SetResourceKvp("zwitch_offset_rz", tostring(offset.rz))

        -- Reattach console prop if open
        if isConsoleOpen and consoleProp and DoesEntityExist(consoleProp) then
            local playerPed = PlayerPedId()
            local boneIdx = GetPedBoneIndex(playerPed, 18905)
            
            DetachEntity(consoleProp, true, true)
            AttachEntityToEntity(
                consoleProp, 
                playerPed, 
                boneIdx, 
                offset.x, offset.y, offset.z, 
                offset.rx, offset.ry, offset.rz, 
                false, -- p9
                true, -- useSoftPinning
                false, -- collision
                false, -- isPed
                2, -- vertexIndex
                true -- fixedRot
            )
        end
    end
    cb('ok')
end)

RegisterNUICallback('toggleMouse', function(data, cb)
    isMouseFocused = not isMouseFocused
    SetNuiFocus(true, isMouseFocused)
    cb(isMouseFocused)
end)

-- Cleanup on resource stop
AddEventHandler('onResourceStop', function(resourceName)
    if GetCurrentResourceName() == resourceName then
        CloseConsole()
    end
end)

-- Developer Attachment Calibration Command
-- Usage: /consoleoffset [x] [y] [z] [rx] [ry] [rz]
-- Example: /consoleoffset 0.15 -0.02 -0.03 -70.0 180.0 80.0
RegisterCommand('consoleoffset', function(source, args, rawCommand)
    -- Check if player is holding the console
    if not isConsoleOpen or not consoleProp then
        TriggerEvent('chat:addMessage', {
            args = { "^1SYSTEM", "You must open the console (Press I) before adjusting the offset!" }
        })
        return
    end

    if #args >= 6 then
        offset.x = tonumber(args[1]) or offset.x
        offset.y = tonumber(args[2]) or offset.y
        offset.z = tonumber(args[3]) or offset.z
        offset.rx = tonumber(args[4]) or offset.rx
        offset.ry = tonumber(args[5]) or offset.ry
        offset.rz = tonumber(args[6]) or offset.rz

        -- Reattach with new offset values
        local playerPed = PlayerPedId()
        local boneIdx = GetPedBoneIndex(playerPed, 18905)
        
        DetachEntity(consoleProp, true, true)
        AttachEntityToEntity(
            consoleProp, 
            playerPed, 
            boneIdx, 
            offset.x, offset.y, offset.z, 
            offset.rx, offset.ry, offset.rz, 
            false, -- p9
            true, -- useSoftPinning
            false, -- collision
            false, -- isPed
            2, -- vertexIndex
            true -- fixedRot
        )

        -- Print out configuration code for the dev
        local copyString = string.format("local offset = { x = %.3f, y = %.3f, z = %.3f, rx = %.1f, ry = %.1f, rz = %.1f }", 
            offset.x, offset.y, offset.z, offset.rx, offset.ry, offset.rz)
        
        TriggerEvent('chat:addMessage', {
            args = { "^2CONSOLE OFFSET DETECTED", copyString }
        })
        print("^2[Console Offset]^0 " .. copyString)
    else
        TriggerEvent('chat:addMessage', {
            args = { "^3USAGE", "/consoleoffset [x] [y] [z] [rx] [ry] [rz]" }
        })
    end
end, false)

-- Disable game controls while the console is open to prevent controller/keyboard leak to the ped
Citizen.CreateThread(function()
    while true do
        if isConsoleOpen then
            -- Always disable actions that conflict with emulator or console gameplay
            DisableControlAction(0, 21, true)  -- Sprint
            DisableControlAction(0, 22, true)  -- Jump
            DisableControlAction(0, 23, true)  -- Enter vehicle
            DisableControlAction(0, 24, true)  -- Attack / Shoot
            DisableControlAction(0, 25, true)  -- Aim
            DisableControlAction(0, 37, true)  -- Select Weapon
            DisableControlAction(0, 44, true)  -- Cover
            DisableControlAction(0, 45, true)  -- Reload / Melee
            
            DisableControlAction(0, 140, true) -- Light attack
            DisableControlAction(0, 141, true) -- Heavy attack
            DisableControlAction(0, 142, true) -- Melee alternative
            DisableControlAction(0, 257, true) -- Attack 2
            DisableControlAction(0, 263, true) -- Melee group
            
            DisableControlAction(0, 27, true)  -- Phone
            DisableControlAction(0, 19, true)  -- Character Wheel
            DisableControlAction(0, 14, true)  -- Weapon Next
            DisableControlAction(0, 15, true)  -- Weapon Prev
            
            -- If mouse cursor is visible (NUI focus), disable camera rotation
            if isMouseFocused then
                DisableControlAction(0, 1, true) -- Look Left/Right
                DisableControlAction(0, 2, true) -- Look Up/Down
            end
            
            Citizen.Wait(0)
        else
            Citizen.Wait(250)
        end
    end
end)
