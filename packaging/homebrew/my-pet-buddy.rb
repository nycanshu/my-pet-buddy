# Homebrew Cask for My Pet Buddy (desktop).
#
# Token is `my-pet-buddy` (hyphenated) ON PURPOSE — this is Homebrew's required
# naming style, so your own tap AND a future official homebrew/cask submission use
# the exact same name. Install command stays consistent forever:
#   brew tap nycanshu/tap && brew install my-pet-buddy
#
# This file goes in your OWN tap repo, NOT here. Steps:
#   1. Create a GitHub repo named exactly:  homebrew-tap   (under github.com/nycanshu)
#   2. Put this file at:  Casks/my-pet-buddy.rb
#   3. Publish a GitHub Release (tag v1.0.5) with the UNIVERSAL dmg attached:
#        cd desktop && npx electron-builder --mac dmg --universal --publish never
#      (builds MyPetBuddy-1.0.5-universal.dmg) then upload that .dmg to the release.
#   4. Fill in the sha256 below:
#        shasum -a 256 desktop/release/MyPetBuddy-1.0.5-universal.dmg
#
# Users then install with (Homebrew auto-removes the Gatekeeper quarantine — no warning!):
#   brew tap nycanshu/tap
#   brew install my-pet-buddy

cask "my-pet-buddy" do
  version "1.0.5"
  sha256 "REPLACE_WITH_DMG_SHA256"

  url "https://github.com/nycanshu/my-pet-buddy/releases/download/v#{version}/MyPetBuddy-#{version}-universal.dmg"
  name "My Pet Buddy"
  desc "Cute virtual pet that walks across your desktop"
  homepage "https://github.com/nycanshu/my-pet-buddy"

  app "My Pet Buddy.app"

  # Clean up settings on `brew uninstall --zap`
  zap trash: [
    "~/Library/Application Support/my-pet-buddy-desktop",
  ]
end
