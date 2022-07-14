write-host "`n  ## NODEJS INSTALLER ## `n"

### CONFIGURATION

# nodejs
$version = "14.15.4-x64"
$url = "https://nodejs.org/dist/v14.15.4/node-v14.15.4-x64.msi"

# activate / desactivate any install
$install_node = $TRUE

write-host "`n----------------------------"
write-host " system requirements checking  "
write-host "----------------------------`n"

### require administator rights

if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    write-Warning "This setup needs admin permissions. Please run this file as admin."     
    break
}

### nodejs version check

if (Get-Command node -errorAction SilentlyContinue) {
    $current_version = (node -v)
}
 
if ($current_version) {
    write-host "[NODE] nodejs $current_version already installed"
    $install_node = $FALSE
}

write-host "`n"

if ($install_node) {
    
    ### download nodejs msi file
    # warning : if a node.msi file is already present in the current folder, this script will simply use it
        
    write-host "`n----------------------------"
    write-host "  nodejs msi file retrieving  "
    write-host "----------------------------`n"

    $filename = "node.msi"
    $node_msi = "$PSScriptRoot\$filename"

    write-host "[NODE] downloading nodejs install"
    write-host "url : $url"
    $start_time = Get-Date
    $wc = New-Object System.Net.WebClient
    $wc.DownloadFile($url, $node_msi)
    write-Output "$filename downloaded"
    write-Output "Time taken: $((Get-Date).Subtract($start_time).Seconds) second(s)"
    write-host "`n----------------------------"
    write-host " nodejs installation  "
    write-host "----------------------------`n"
    write-host "[NODE] running $node_msi"
    Start-Process $node_msi -Wait
    
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User") 
    
}
else {
    write-host "Proceeding with the previously installed nodejs version ..."
}

### npm packages install

write-host "`n----------------------------"
write-host " npm packages installation  "
write-host "----------------------------`n"

write-host "Installing pm2"
npm install --global pm2
npm install pm2-windows-startup -g
npm install --global yarn
pm2-startup install

yarn install
pm2 start ./server.js --name server3001
pm2 save
pm2 resurrect