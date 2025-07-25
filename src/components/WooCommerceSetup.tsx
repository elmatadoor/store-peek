import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { wooCommerceService } from '@/services/woocommerce';
import { Store, Settings, Key } from 'lucide-react';

interface WooCommerceSetupProps {
  onConfigured: () => void;
}

export function WooCommerceSetup({ onConfigured }: WooCommerceSetupProps) {
  const [storeUrl, setStoreUrl] = useState('');
  const [consumerKey, setConsumerKey] = useState('');
  const [consumerSecret, setConsumerSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSetup = async () => {
    if (!storeUrl || !consumerKey || !consumerSecret) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Clean up store URL
      const cleanUrl = storeUrl.replace(/\/$/, '');
      
      wooCommerceService.setConfig({
        storeUrl: cleanUrl,
        consumerKey,
        consumerSecret,
      });

      // Test the connection
      const isConnected = await wooCommerceService.testConnection();
      
      if (isConnected) {
        toast({
          title: "Connected Successfully!",
          description: "Your WooCommerce store is now connected.",
        });
        onConfigured();
      } else {
        throw new Error('Connection test failed');
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Store className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Connect Your Store</CardTitle>
            <p className="text-muted-foreground mt-2">
              Enter your WooCommerce API credentials to get started
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="storeUrl" className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              Store URL
            </Label>
            <Input
              id="storeUrl"
              placeholder="https://your-store.com"
              value={storeUrl}
              onChange={(e) => setStoreUrl(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="consumerKey" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              Consumer Key
            </Label>
            <Input
              id="consumerKey"
              placeholder="ck_..."
              value={consumerKey}
              onChange={(e) => setConsumerKey(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="consumerSecret" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Consumer Secret
            </Label>
            <Input
              id="consumerSecret"
              type="password"
              placeholder="cs_..."
              value={consumerSecret}
              onChange={(e) => setConsumerSecret(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={handleSetup} 
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Connecting..." : "Connect Store"}
          </Button>
          
          <div className="text-xs text-muted-foreground text-center mt-4">
            Your credentials are stored securely in your browser's local storage
          </div>
        </CardContent>
      </Card>
    </div>
  );
}