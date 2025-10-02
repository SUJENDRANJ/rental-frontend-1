import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { CircleCheck as CheckCircle, Circle as XCircle, Clock, CircleAlert as AlertCircle, FileText, Video, Phone, User, Mail, Calendar, Loader as Loader2 } from 'lucide-react';
import {
  getAllKYCSubmissions,
  approveKYC,
  rejectKYC,
  type KYCWithProfile
} from '../services/kycService';
import { useToast } from '../hooks/use-toast';
import { useAppSelector } from '../hooks/useAppSelector';

export default function AdminKYCReview() {
  const { toast } = useToast();
  const user = useAppSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<KYCWithProfile[]>([]);
  const [selectedKYC, setSelectedKYC] = useState<KYCWithProfile | null>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadSubmissions();
  }, [activeTab]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const data = await getAllKYCSubmissions(
        activeTab === 'all' ? undefined : activeTab
      );
      setSubmissions(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load KYC submissions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (kycId: string) => {
    if (!user?.id) return;

    try {
      setProcessing(true);
      await approveKYC(kycId, user.id);

      toast({
        title: 'KYC Approved',
        description: 'User has been verified and can now act as a host.',
      });

      setSelectedKYC(null);
      loadSubmissions();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to approve KYC',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedKYC?.id || !user?.id || !rejectionReason.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a reason for rejection',
        variant: 'destructive',
      });
      return;
    }

    try {
      setProcessing(true);
      await rejectKYC(selectedKYC.id, user.id, rejectionReason);

      toast({
        title: 'KYC Rejected',
        description: 'User has been notified of the rejection.',
      });

      setShowRejectDialog(false);
      setRejectionReason('');
      setSelectedKYC(null);
      loadSubmissions();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to reject KYC',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'under_review':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      approved: 'default',
      rejected: 'destructive',
      under_review: 'secondary',
      pending: 'outline',
    };
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">KYC Verification Review</h1>
          <p className="text-muted-foreground">
            Review and approve host verification submissions
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="under_review">Under Review</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : submissions.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                    <p>No KYC submissions found</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {submissions.map((kyc) => (
                  <Card key={kyc.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={kyc.profile?.avatar_url} />
                            <AvatarFallback>
                              {kyc.profile?.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 space-y-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">
                                  {kyc.profile?.full_name || 'Unknown User'}
                                </h3>
                                {getStatusBadge(kyc.status)}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {kyc.profile?.email}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {kyc.phone_number}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-6 text-sm">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                <span className="capitalize">
                                  {kyc.government_id_type?.replace('_', ' ')}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span>
                                  {kyc.submitted_at
                                    ? new Date(kyc.submitted_at).toLocaleDateString()
                                    : 'Not submitted'}
                                </span>
                              </div>
                            </div>

                            {kyc.rejection_reason && (
                              <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                  Rejection Reason: {kyc.rejection_reason}
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        </div>

                        <Button
                          onClick={() => setSelectedKYC(kyc)}
                          variant="outline"
                        >
                          Review Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={!!selectedKYC} onOpenChange={() => setSelectedKYC(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>KYC Verification Details</DialogTitle>
              <DialogDescription>
                Review all submitted information before making a decision
              </DialogDescription>
            </DialogHeader>

            {selectedKYC && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={selectedKYC.profile?.avatar_url} />
                    <AvatarFallback>
                      {selectedKYC.profile?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {selectedKYC.profile?.full_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedKYC.profile?.email}
                    </p>
                  </div>
                  {getStatusBadge(selectedKYC.status)}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Phone Number</Label>
                    <p className="font-medium">{selectedKYC.phone_number}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">ID Type</Label>
                    <p className="font-medium capitalize">
                      {selectedKYC.government_id_type?.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Submitted At</Label>
                    <p className="font-medium">
                      {selectedKYC.submitted_at
                        ? new Date(selectedKYC.submitted_at).toLocaleString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedKYC.status)}
                      <span className="capitalize">{selectedKYC.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Verification Video
                    </Label>
                    {selectedKYC.video_url ? (
                      <video
                        src={selectedKYC.video_url}
                        controls
                        className="w-full aspect-video bg-black rounded-lg"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">No video uploaded</p>
                    )}
                  </div>

                  <div>
                    <Label className="mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Government ID Document
                    </Label>
                    {selectedKYC.government_id_url ? (
                      <div className="border rounded-lg overflow-hidden">
                        <img
                          src={selectedKYC.government_id_url}
                          alt="Government ID"
                          className="w-full h-auto"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No document uploaded</p>
                    )}
                  </div>
                </div>

                {selectedKYC.rejection_reason && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Previous Rejection Reason:</strong> {selectedKYC.rejection_reason}
                    </AlertDescription>
                  </Alert>
                )}

                {selectedKYC.status === 'pending' || selectedKYC.status === 'under_review' ? (
                  <DialogFooter className="gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedKYC(null)}
                      disabled={processing}
                    >
                      Close
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setShowRejectDialog(true)}
                      disabled={processing}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => selectedKYC.id && handleApprove(selectedKYC.id)}
                      disabled={processing}
                    >
                      {processing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  </DialogFooter>
                ) : (
                  <DialogFooter>
                    <Button onClick={() => setSelectedKYC(null)}>Close</Button>
                  </DialogFooter>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject KYC Verification</DialogTitle>
              <DialogDescription>
                Please provide a clear reason for rejection. This will be sent to the user.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Rejection Reason</Label>
                <Textarea
                  id="reason"
                  placeholder="e.g., Document image is unclear, video quality is poor, information doesn't match..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectionReason('');
                }}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={processing || !rejectionReason.trim()}
              >
                {processing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Confirm Rejection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
