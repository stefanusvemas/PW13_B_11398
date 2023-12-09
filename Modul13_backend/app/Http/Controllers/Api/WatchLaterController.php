<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WatchLaters;
use App\Models\User;
use App\Models\Contents;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class WatchLaterController extends Controller
{
    public function showWatchLaterbyUser($id, $filter = null)
    {
        $user = User::find($id);
        $today = Carbon::today();
        if (!$user) {
            return response([
                'message' => 'User Not Found',
                'data' => null
            ], 404);
        }

        if ($filter) {
            switch ($filter) {
                case 'today':
                    $watchLater = WatchLaters::where('id_user', $user->id)->whereDate('date_added', Carbon::today()->format("Y-m-d"))->get()->load('content');
                    break;
                case 'yesterday':
                    $watchLater = WatchLaters::where('id_user', $user->id)->whereDate('date_added', Carbon::yesterday()->format("Y-m-d"))->get()->load('content');
                    break;
                case 'this_month':
                    $watchLater = WatchLaters::where('id_user', $user->id)->whereMonth('date_added', Carbon::now()->month)->whereYear('date_added', Carbon::now()->year)->get()->load('content');
                    break;
                case 'this_year':
                    $watchLater = WatchLaters::where('id_user', $user->id)->whereYear('date_added', Carbon::now()->year)->get()->load('content');
                    break;
                default:
                    break;
            }
        } else {
            $watchLater = WatchLaters::where('id_user', $user->id)->get()->load('content');
        }

        if ($watchLater->isEmpty()) {
            return response([
                'message' => 'Watch Later List is Empty',
                'data' => null
            ], 200);
        }

        $watchLater->transform(function ($item) {
            $item['date_added'] = date_create($item['date_added'])->format('Y-m-d');
            return $item;
        });
        return response([
            'message' => 'Contents of ' . $user->name . ' Retrieved',
            'data' => $watchLater
        ], 200);
    }

    public function store(Request $request)
    {
        $storeData = $request->all();
        $content = Contents::where('id_user', Auth::user()->id)->get();

        $validate = Validator::make($storeData, [
            'id_user' => 'required',
            'id_content' => 'required',
        ]);
        if ($validate->fails()) {
            return response(['message' => $validate->errors()], 400);
        }

        if (WatchLaters::where('id_user', $storeData['id_user'])->where('id_content', $storeData['id_content'])->exists()) {
            return response([
                'message' => 'Content Already in Your Watch Later List',
                'data' => null
            ], 400);
        }

        if ($content->contains('id', $storeData['id_content'])) {
            return response([
                'message' => 'You cannot add your own content to Watch Later',
                'data' => null
            ], 400);
        }


        $storeData['date_added'] = date('Y-m-d H:i:s');

        $watchLater = WatchLaters::create($storeData);

        return response([
            'message' => 'Watch Later Added',
            'data' => $watchLater
        ], 200);
    }

    public function destroy($id)
    {
        $watchLater = WatchLaters::find($id);
        if (!$watchLater) {
            return response([
                'message' => 'Watch Later Not Found',
                'data' => null
            ], 404);
        }
        if ($watchLater->delete()) {
            return response([
                'message' => 'Removed from Your Watch Later List',
                'data' => $watchLater
            ], 200);
        }
        return response([
            'message' => 'Delete Watch Later Failed',
            'data' => null
        ], 400);
    }
}
